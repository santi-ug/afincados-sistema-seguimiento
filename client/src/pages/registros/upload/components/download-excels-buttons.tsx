'use client';

import { Button } from '@/components/ui/button';
import { downloadExcel } from '@/lib/api/registros';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';

interface DownloadExcelsButtonProps {
	startDate: string;
	endDate: string;
}

export function DownloadExcelsButton({
	startDate,
	endDate,
}: DownloadExcelsButtonProps) {
	const handleDownload = async (
		type: 'liberacion' | 'despacho' | 'empaque'
	) => {
		const downloadingToast = toast.loading(`Descargando ${type}...`);

		try {
			const blob = await downloadExcel({ startDate, endDate, format: type });
			const formattedStartDate = startDate.split('-').reverse().join('-');
			const formattedEndDate = endDate.split('-').reverse().join('-');
			saveAs(
				blob,
				`registros-${type}-${formattedStartDate}-${formattedEndDate}.xlsx`
			);
			toast.success(
				`${type.charAt(0).toUpperCase() + type.slice(1)} descargado!`
			);
		} catch (error) {
			console.error('Error descargando:', error);
			toast.error('Error descargando archivo.');
		} finally {
			toast.dismiss(downloadingToast);
		}
	};

	return (
		<div className='max-w-50 flex flex-col gap-4'>
			<Button onClick={() => handleDownload('liberacion')}>
				Descargar Liberación
			</Button>
			<Button onClick={() => handleDownload('despacho')}>
				Descargar Despacho
			</Button>
			<Button onClick={() => handleDownload('empaque')}>
				Descargar Empaque
			</Button>
		</div>
	);
}

export default DownloadExcelsButton;
