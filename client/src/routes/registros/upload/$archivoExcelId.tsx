import RegistrosUploadPage from '@/pages/registros/upload/index';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/registros/upload/$archivoExcelId')({
	component: RegistrosUploadPage,
});
