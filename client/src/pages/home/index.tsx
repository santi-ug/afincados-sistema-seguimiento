import { Main } from '@/components/layout/main';
import { getEmpleados } from '@/lib/api/empleados';
import { getRegistros } from '@/lib/api/registros';
import { Empleado } from '@/lib/schemas/empleados';
import { Registro } from '@/lib/schemas/registros';
import { addDays, isAfter, isBefore } from 'date-fns';
import { useEffect, useState } from 'react';
import { columns } from './components/registros-columns';
import { RegistrosTable } from './components/registros-table';
import { DialogUploaderDemo } from './components/registros-upload-excel';

export default function Registros() {
	const [registros, setRegistros] = useState<Registro[]>([]);
	const [empleados, setEmpleados] = useState<Empleado[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
	const [fechaFin, setFechaFin] = useState<Date | null>(null);

	const fetchEmpleados = async () => {
		try {
			const data = await getEmpleados();
			setEmpleados(data);
		} catch (err) {
			setError('Error fetching empleados');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const fetchRegistros = async () => {
		try {
			const data = await getRegistros();
			setRegistros(data);
		} catch (err) {
			setError('Error fetching registros');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRegistros();
		fetchEmpleados();
	}, []);

	if (loading) {
		return <div>Cargando registros...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	const filteredRegistros =
		fechaInicio && fechaFin
			? registros.filter((registro) => {
					const fecha = registro.fechaProduccion;
					return (
						fecha instanceof Date &&
						!isNaN(fecha.getTime()) &&
						!isBefore(fecha, fechaInicio) &&
						!isAfter(fecha, addDays(fechaFin, 1))
					);
				})
			: [];

	return (
		<Main>
			<div className='w-full mb-2 flex flex-wrap items-center justify-between space-y-2'>
				<div>
					<h2 className='text-2xl font-bold tracking-tight'>Registros</h2>
					<p className='text-muted-foreground'>
						Administra los registros cargados. Puedes revisar, editar o eliminar
						registros.
					</p>
					{!fechaInicio || !fechaFin ? (
						<p className='text-amber-600'>
							Por favor seleccionar un rango de fechas para filtrar los
							registros.
						</p>
					) : null}
				</div>
				<DialogUploaderDemo />
			</div>

			<div className='flex-1 overflow-auto py-1'>
				<RegistrosTable
					data={filteredRegistros}
					columns={columns}
					empleados={empleados}
					fechaInicio={fechaInicio}
					setFechaInicio={setFechaInicio}
					fechaFin={fechaFin}
					setFechaFin={setFechaFin}
				/>
			</div>
		</Main>
	);
}
