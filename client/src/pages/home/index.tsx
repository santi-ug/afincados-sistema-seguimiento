import { Main } from '@/components/layout/main';
import { getRegistros } from '@/lib/api/registros'; // 👈 cambias api productos -> registros
import { Registro } from '@/lib/schemas/registros'; // 👈 tipo Registro
import { useEffect, useState } from 'react';
// import { Dialogs } from './components/dialogs'; // 👈 ya te lo adaptaré si quieres
import { columns } from './components/registros-columns'; // 👈 columnas de registros
import { RegistrosTable } from './components/registros-table'; // 👈 tabla de registros
import { DialogUploaderDemo } from './components/registros-upload-excel'; // 👈 botón de acciones principales
import { RegistrosProvider } from './context/registros-context'; // 👈 context de registros

export default function Registros() {
	const [registros, setRegistros] = useState<Registro[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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
	}, []);

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
						<h2 className='text-2xl font-bold tracking-tight'>Registros</h2>
						<p className='text-muted-foreground'>
							Administra los registros cargados. Puedes revisar, editar o
							eliminar registros.
						</p>
					</div>
					<DialogUploaderDemo />
				</div>

				<div className='flex-1 overflow-auto py-1'>
					<RegistrosTable data={registros} columns={columns} />
				</div>
			</Main>
		</RegistrosProvider>
	);
}
