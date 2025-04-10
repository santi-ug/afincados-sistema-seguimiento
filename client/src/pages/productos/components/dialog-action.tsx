'use client';

import { SelectDropdown } from '@/components/select-dropdown';
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
import { createProducto, updateProducto } from '@/lib/api/productos';
import {
	Producto,
	categoriaOptions,
	productoInputSchema,
} from '@/lib/schemas/productos';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = productoInputSchema.extend({
	gramajes: z.string().min(1, 'Ingrese al menos un gramaje.'), // as string in the form
	isEdit: z.boolean(),
});

type ProductoForm = z.infer<typeof formSchema>;

interface Props {
	currentRow?: Producto;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	refetchProductos: () => Promise<void>;
}

export function DialogAction({
	currentRow,
	open,
	onOpenChange,
	refetchProductos,
}: Props) {
	const isEdit = !!currentRow;

	const form = useForm<ProductoForm>({
		resolver: zodResolver(formSchema),
		defaultValues: isEdit
			? {
					nombre: currentRow.nombre,
					gramajes: currentRow.gramajes.join(', '), // ok to display
					categoria: currentRow.categoria,
					isEdit,
				}
			: {
					nombre: '',
					gramajes: '',
					categoria: undefined,
					isEdit,
				},
	});

	const onSubmit = async (values: ProductoForm) => {
		// You might want to transform gramajes back to array here if needed
		const payload = {
			...values,
			gramajes: values.gramajes.split(',').map((g) => Number(g.trim())),
		};

		try {
			if (isEdit && currentRow) {
				await updateProducto(currentRow.id, payload); // Assuming you have an update function
				toast.success('Producto actualizado');
			} else {
				await createProducto(payload);
				toast.success('Producto creado');
			}

			await refetchProductos(); // Refetch the products after creating/updating
		} catch (error) {
			console.error('Error submitting form:', error);
			toast.error('Hubo un error al guardar el producto.');
		}

		form.reset();
		onOpenChange(false);
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
						{isEdit ? 'Editar Producto' : 'Crear Producto'}
					</DialogTitle>
					<DialogDescription>
						{isEdit
							? 'Actualiza la información del producto.'
							: 'Agrega un nuevo producto a tu inventario.'}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						id='producto-form'
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
										<Input placeholder='Ej: Ajo en Polvo' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='gramajes'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Gramajes (separados por coma)</FormLabel>
									<FormControl>
										<Input placeholder='Ej: 30, 50, 250' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='categoria'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Categoría</FormLabel>
									<SelectDropdown
										defaultValue={field.value}
										onValueChange={field.onChange}
										placeholder='Seleccione una categoría'
										items={categoriaOptions.map((cat) => ({
											label: cat,
											value: cat,
										}))}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>

				<DialogFooter>
					<Button type='submit' form='producto-form'>
						Guardar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
