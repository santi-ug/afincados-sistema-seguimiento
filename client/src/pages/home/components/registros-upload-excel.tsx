import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { uploadArchivoExcel } from '@/lib/api/registros';
import { useRouter } from '@tanstack/react-router'; // <-- Import TanStack router
import { useState } from 'react';
import { toast } from 'sonner'; // (You were mixing react-hot-toast and sonner, I'll keep it clean with sonner here)
import { FileUploader } from './file-uploader';

export function DialogUploaderDemo() {
	const [files, setFiles] = useState<File[]>([]);
	const [open, setOpen] = useState(false);
	const router = useRouter(); // <-- TanStack Router

	const handleUpload = async (filesToUpload: File[]) => {
		if (!filesToUpload.length) return;

		try {
			const response = await uploadArchivoExcel(filesToUpload[0]);

			const archivoExcelId = response.archivoExcelId; // ⬅️ Make sure your API returns it
			if (!archivoExcelId) {
				throw new Error('Missing archivoExcelId from upload response');
			}

			toast.success('¡Archivo Excel cargado exitosamente!');
			setFiles([]);
			setOpen(false); // Close dialog

			// Redirect to registros/upload/:archivoExcelId
			router.navigate({
				to: '/registros/upload/$archivoExcelId',
				params: { archivoExcelId: String(archivoExcelId) },
			});
		} catch (error) {
			console.error(error);
			toast.error(`Hubo un error subiendo el archivo`);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className='space-x-1 cursor-pointer'>
					Subir Archivo Excel {files.length > 0 && `(${files.length})`}
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-xl'>
				<DialogHeader>
					<DialogTitle>Subir Archivo Excel</DialogTitle>
					<DialogDescription>
						Arrastra y suelta tus archivos aquí o haz clic para buscarlos.
					</DialogDescription>
				</DialogHeader>
				<FileUploader
					value={files}
					onValueChange={setFiles}
					onUpload={handleUpload}
					accept={{
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
							['.xlsx'],
					}}
					maxSize={5 * 1024 * 1024}
					maxFileCount={1}
					multiple={false}
				/>
			</DialogContent>
		</Dialog>
	);
}
