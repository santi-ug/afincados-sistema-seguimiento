'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { createEmpleado, updateEmpleado } from '@/lib/api/empleados'; // <-- employees API
import { Empleado, empleadoInputSchema } from '@/lib/schemas/empleados'; // <-- empleado schema
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = empleadoInputSchema.extend({
	nombre: z
		.string()
		.min(1, 'Nombre es requerido.')
		.regex(
			/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
			'El nombre solo puede contener letras y espacios.'
		)
		.refine(
			(value) => value.trim().split(/\s+/).length >= 2,
			'El nombre debe contener al menos dos palabras (nombre y apellido).'
		),
	isEdit: z.boolean(),
});
type EmpleadoForm = z.infer<typeof formSchema>;

interface Props {
	currentRow?: Empleado;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	refetchEmpleados: () => Promise<void>;
}

export function DialogAction({
	currentRow,
	open,
	onOpenChange,
	refetchEmpleados,
}: Props) {
	const isEdit = !!currentRow;

	const form = useForm<EmpleadoForm>({
		resolver: zodResolver(formSchema),
		defaultValues: isEdit
			? {
					nombre: currentRow.nombre,
					isEdit,
				}
			: {
					nombre: '',
					isEdit,
				},
	});

	const onSubmit = async (values: EmpleadoForm) => {
		try {
			if (isEdit && currentRow) {
				await updateEmpleado(String(currentRow.id), values);
				toast.success('Empleado actualizado');
			} else {
				await createEmpleado(values);
				toast.success('Empleado creado');
			}

			await refetchEmpleados();
			form.reset();
			onOpenChange(false);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error('Error submitting form:', error);

			if (
				error.response?.status === 400 &&
				error.response?.data?.error?.includes('empleado con ese nombre')
			) {
				form.setError('nombre', {
					type: 'manual',
					message: 'Ya existe un empleado con ese nombre.',
				});
			} else {
				toast.error('Hubo un error al guardar el empleado.');
			}
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(state) => {
				form.reset();
				onOpenChange(state);
			}}
		>
			<DialogContent className='sm:max-w-lg'>
				<DialogHeader className='text-left'>
					<DialogTitle>
						{isEdit ? 'Editar Empleado' : 'Crear Empleado'}
					</DialogTitle>
					<DialogDescription>
						{isEdit
							? 'Actualiza la información del empleado.'
							: 'Agrega un nuevo empleado.'}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						id='empleado-form'
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4 p-0.5'
					>
						<FormField
							control={form.control}
							name='nombre'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre</FormLabel>
									<FormControl>
										<Input placeholder='Ej: Juan Pérez' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>

				<DialogFooter>
					<Button type='submit' form='empleado-form'>
						Guardar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
