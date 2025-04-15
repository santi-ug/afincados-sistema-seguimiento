import { Main } from '@/components/layout/main';
import { Button } from '@/components/ui/button';
import { getEmpleados } from '@/lib/api/empleados';
import { getProductos } from '@/lib/api/productos'; // 🚨 Import API to fetch productos
import {
	getRegistrosByArchivoExcelId,
	updateRegistrosBulk,
} from '@/lib/api/registros';
import { Empleado } from '@/lib/schemas/empleados';
import { Producto } from '@/lib/schemas/productos'; // 🚨 Import Producto type
import { Registro, RegistroUpdate } from '@/lib/schemas/registros';
import { Route } from '@/routes/registros/upload/$archivoExcelId';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DownloadExcelsButton from './components/download-excels-buttons';
import { getUploadColumns } from './components/registros-columns';
import { RegistrosTable } from './components/registros-table';
import { RegistrosProvider } from './context/registros-context';

export default function RegistrosUploadPage() {
	const { archivoExcelId } = Route.useParams();

	const [registros, setRegistros] = useState<Registro[]>([]);
	const [productos, setProductos] = useState<Producto[]>([]);
	const [empleados, setEmpleados] = useState<Empleado[]>([]); // 🚨 Import Empleado type
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const handleConfirmar = async () => {
		const invalidRows = registros.filter((r) => {
			return (
				// Campos obligatorios que no pueden ser null, undefined o vacíos
				r.id == null ||
				!r.productoId ||
				r.gramaje == null ||
				r.cantidad == null ||
				!r.fechaProduccion ||
				!r.fechaVencimiento ||
				!r.materialType ||
				r.condVerificado == null ||
				r.hierbasVerificado == null ||
				r.reposteriaVerificado == null ||
				r.empaqueVerificado == null ||
				r.empleadoId == null ||
				r.paquetesCantidad == null ||
				isNaN(r.paquetesCantidad) ||
				!r.accionResultado ||
				!r.cliente ||
				!r.nombreProducto ||
				!r.lote ||
				r.paramCalidadEmpaque == null ||
				r.paramCalidadPeso == null ||
				r.paramCalidadSinPresenciaDeSustanciasExtranas == null ||
				!r.hora ||
				typeof r.hora !== 'string' ||
				!/^\d{2}:\d{2}$/.test(r.hora) ||
				r.olor == null ||
				r.color == null ||
				r.sabor == null ||
				r.varProcesoConforme == null ||
				r.empaqueConforme == null ||
				r.libera == null ||
				// ❗️ Observaciones y AccionesCorrectivas sí pueden ser nulos o vacíos, no los validamos
				false // para mantener estilo visual, puedes quitar si quieres
			);
		});

		if (invalidRows.length > 0) {
			toast.error(
				'Hay registros incompletos o inválidos. Corrige antes de confirmar.'
			);
			console.log('registros invalidos', invalidRows);
			return;
		}

		try {
			await updateRegistrosBulk(registros as unknown as RegistroUpdate[]);
			toast.success('Registros confirmados exitosamente.');
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
				toast.error(error.message);
			} else {
				console.error(error);
				toast.error('Error confirmando registros.');
			}
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleCellEdit = (rowId: number, field: keyof Registro, value: any) => {
		setRegistros((prev) =>
			prev.map((row) => {
				if (row.id !== rowId) return row;

				const updatedRow = { ...row, [field]: value };

				// 🔥 1. If productoId changes, also update nombreProducto
				if (field === 'productoId') {
					const producto = productos.find((p) => p.id === value);
					updatedRow.nombreProducto = producto?.nombre ?? '';
				}

				// 🔥 2. If materialType changes, set cond/hierbas/reposteria checks
				if (field === 'materialType') {
					updatedRow.condVerificado = value === 'CONDIMENTO';
					updatedRow.hierbasVerificado = value === 'HIERBAS';
					updatedRow.reposteriaVerificado = value === 'REPOSTERIA';
				}

				// 🔥 3. If cantidad (units) is set, copy it into paquetesCantidad
				if (field === 'cantidad') {
					updatedRow.paquetesCantidad = value;
				}

				if (field === 'fechaProduccion') {
					if (value instanceof Date && !isNaN(value.getTime())) {
						const today = new Date();
						today.setHours(0, 0, 0, 0); // Normalize today to midnight

						if (value <= today) {
							const fechaProduccionDate = value;
							const fechaVencimientoDate = new Date(fechaProduccionDate);
							fechaVencimientoDate.setDate(
								fechaVencimientoDate.getDate() + 365
							);

							updatedRow.fechaProduccion = fechaProduccionDate;
							updatedRow.fechaVencimiento = fechaVencimientoDate;
						} else {
							// Date is invalid (after today)
							updatedRow.fechaProduccion = null;
							updatedRow.fechaVencimiento = null;
						}
					} else {
						// Invalid date object
						updatedRow.fechaProduccion = null;
						updatedRow.fechaVencimiento = null;
					}
				}

				if (field === 'cliente') {
					const inputValue = typeof value === 'string' ? value.trim() : '';

					// 🔥 Normalize input: remove accents, make uppercase
					const normalized = inputValue
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '') // Remove diacritics (tildes)
						.toUpperCase();

					if (normalized === 'RUTA UNICA') {
						updatedRow.cliente = 'RUTA UNICA'; // 🔥 Save it normalized, no tildes
					} else if (inputValue === '') {
						updatedRow.cliente = null;
					} else {
						updatedRow.cliente = inputValue; // Save trimmed input as is
					}
				}

				return updatedRow;
			})
		);
	};

	const handleMassiveEdit = (
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		updates: { rowId: number; field: keyof Registro; value: any }[]
	) => {
		setRegistros((prev) =>
			prev.map((row) => {
				const update = updates.find((u) => u.rowId === row.id);
				if (update) {
					return { ...row, [update.field]: update.value };
				}
				return row;
			})
		);
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleMassiveEditWithLogic = (field: keyof Registro, value: any) => {
		if (field === 'fechaProduccion') {
			if (value instanceof Date && !isNaN(value.getTime())) {
				const today = new Date();
				today.setHours(0, 0, 0, 0);

				if (value <= today) {
					const updates = registros.flatMap((r) => {
						const fechaProduccionDate = value;
						const fechaVencimientoDate = new Date(fechaProduccionDate);
						fechaVencimientoDate.setDate(fechaVencimientoDate.getDate() + 365);

						return [
							{
								rowId: r.id,
								field: 'fechaProduccion',
								value: fechaProduccionDate,
							},
							{
								rowId: r.id,
								field: 'fechaVencimiento',
								value: fechaVencimientoDate,
							},
						];
					});

					setRegistros((prev) =>
						prev.map((row) => {
							const updateFechaProd = updates.find(
								(u) => u.rowId === row.id && u.field === 'fechaProduccion'
							);
							const updateFechaVenc = updates.find(
								(u) => u.rowId === row.id && u.field === 'fechaVencimiento'
							);
							if (updateFechaProd || updateFechaVenc) {
								return {
									...row,
									fechaProduccion:
										updateFechaProd?.value ?? row.fechaProduccion,
									fechaVencimiento:
										updateFechaVenc?.value ?? row.fechaVencimiento,
								};
							}
							return row;
						})
					);
				} else {
					// Selected a date in the future — invalid
					const updates = registros.flatMap((r) => [
						{ rowId: r.id, field: 'fechaProduccion', value: null },
						{ rowId: r.id, field: 'fechaVencimiento', value: null },
					]);

					setRegistros((prev) =>
						prev.map((row) => {
							const updateFechaProd = updates.find(
								(u) => u.rowId === row.id && u.field === 'fechaProduccion'
							);
							const updateFechaVenc = updates.find(
								(u) => u.rowId === row.id && u.field === 'fechaVencimiento'
							);
							if (updateFechaProd || updateFechaVenc) {
								return {
									...row,
									fechaProduccion:
										updateFechaProd?.value ?? row.fechaProduccion,
									fechaVencimiento:
										updateFechaVenc?.value ?? row.fechaVencimiento,
								};
							}
							return row;
						})
					);
				}
			} else {
				// Invalid input (shouldn't happen but safe)
				const updates = registros.flatMap((r) => [
					{ rowId: r.id, field: 'fechaProduccion', value: null },
					{ rowId: r.id, field: 'fechaVencimiento', value: null },
				]);

				setRegistros((prev) =>
					prev.map((row) => {
						const updateFechaProd = updates.find(
							(u) => u.rowId === row.id && u.field === 'fechaProduccion'
						);
						const updateFechaVenc = updates.find(
							(u) => u.rowId === row.id && u.field === 'fechaVencimiento'
						);
						if (updateFechaProd || updateFechaVenc) {
							return {
								...row,
								fechaProduccion: updateFechaProd?.value ?? row.fechaProduccion,
								fechaVencimiento:
									updateFechaVenc?.value ?? row.fechaVencimiento,
							};
						}
						return row;
					})
				);
			}
		} else if (field === 'cliente') {
			setRegistros((prev) =>
				prev.map((row) => {
					const inputValue = typeof value === 'string' ? value.trim() : '';

					const normalized = inputValue
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
						.toUpperCase();

					let clienteFinal: string | null;
					if (normalized === 'RUTA UNICA') {
						clienteFinal = 'RUTA UNICA';
					} else if (inputValue === '') {
						clienteFinal = null;
					} else {
						clienteFinal = inputValue;
					}

					return {
						...row,
						cliente: clienteFinal,
					};
				})
			);
		} else {
			// Normal massive edit
			setRegistros((prev) =>
				prev.map((row) => ({
					...row,
					[field]: value,
				}))
			);
		}
	};

	useEffect(() => {
		const fetchRegistros = async () => {
			try {
				const data = await getRegistrosByArchivoExcelId(Number(archivoExcelId));
				setRegistros(data);
			} catch (err) {
				setError('Error fetching registros');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		const fetchProductos = async () => {
			try {
				const data = await getProductos();
				setProductos(data);
			} catch (err) {
				console.error('Error fetching productos:', err);
			}
		};

		const fetchEmpleados = async () => {
			try {
				const data = await getEmpleados();
				setEmpleados(data);
			} catch (err) {
				console.error('Error fetching empleados:', err);
			}
		};

		fetchRegistros();
		fetchProductos();
		fetchEmpleados();
	}, [archivoExcelId]);

	const formatDate = (date: Date) => {
		return date.toISOString().split('T')[0]; // 'yyyy-mm-dd'
	};

	const fechasProduccion = registros
		.map((r) => (r.fechaProduccion ? new Date(r.fechaProduccion) : null))
		.filter((d): d is Date => d instanceof Date && !isNaN(d.getTime()));

	const minDate =
		fechasProduccion.length > 0
			? new Date(Math.min(...fechasProduccion.map((d) => d.getTime())))
			: new Date(); // fallback today

	const maxDate =
		fechasProduccion.length > 0
			? new Date(Math.max(...fechasProduccion.map((d) => d.getTime())))
			: new Date(); // fallback today

	if (loading) {
		return <div>Cargando registros...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<RegistrosProvider>
			<Main>
				<div className='w-full mb-2 flex flex-wrap items-center justify-between space-y-2'>
					<div>
						<h2 className='text-2xl font-bold tracking-tight'>
							Editar registros cargados
						</h2>
						<p className='text-muted-foreground'>
							Completa los datos faltantes antes de generar los Excel.
						</p>
						<p className='text-red-500'>
							Por favor hundir 'ENTER' al terminar de llenar campos de texto!
						</p>
					</div>
				</div>

				<div className='flex-1 overflow-auto py-1'>
					<RegistrosTable
						data={registros}
						columns={getUploadColumns({
							handleCellEdit,
							handleMassiveEdit,
							handleMassiveEditWithLogic,
							registros,
							productos,
							empleados,
						})}
					/>
					<div className='flex w-full flex-col justify-start my-4 gap-4'>
						<Button className='bg-green-800' onClick={() => handleConfirmar()}>
							Confirmar
						</Button>
					</div>
					<DownloadExcelsButton
						startDate={formatDate(minDate)}
						endDate={formatDate(maxDate)}
					/>
				</div>
			</Main>
		</RegistrosProvider>
	);
}
