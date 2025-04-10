import { Main } from '@/components/layout/main';
import { getEmpleados } from '@/lib/api/empleados';
import { Empleado } from '@/lib/schemas/empleados';
import { useEffect, useState } from 'react';
import { Dialogs } from '../empleados/components/dialogs';
import { columns } from '../empleados/components/empleados-columns';
import { EmpleadosPrimaryButton } from './components/empleado-primary-buttons';
import { EmpleadosTable } from './components/empleados-table';
import { EmpleadosProvider } from './context/empleados-context';

export default function Empleados() {
	const [empleados, setEmpleados] = useState<Empleado[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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

	useEffect(() => {
		fetchEmpleados();
	}, []);

	if (loading) {
		return <div>Cargando empleados...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<EmpleadosProvider>
			<Main>
				<div className='w-full mb-2 flex flex-wrap items-center justify-between space-y-2'>
					<div>
						<h2 className='text-2xl font-bold tracking-tight'>Empleados</h2>
						<p className='text-muted-foreground'>
							Administra los Empleados de tu tienda. Puedes crear, editar y
							eliminar Empleados.
						</p>
					</div>
					<EmpleadosPrimaryButton />
				</div>

				<div className='flex-1 overflow-auto py-1'>
					<EmpleadosTable data={empleados} columns={columns} />
				</div>
			</Main>

			<Dialogs refetchEmpleados={fetchEmpleados} />
		</EmpleadosProvider>
	);
}
