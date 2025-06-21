'use client';

import React, { ReactNode } from 'react';
import { useForm, useFieldArray, Controller, FieldValues, Control, FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';
import { Database } from '@/lib/database.types';
import { Button } from '@/components/Buttons/Button';
import { Input } from '@/components/Inputs/Input';
import { Label } from '@/components/Labels/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Selects/Select';
import { Trash2 } from 'lucide-react';

type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];
type Product = Database['public']['Tables']['products']['Row'];
type Supplier = Database['public']['Tables']['suppliers']['Row'];

interface OrderFormValues extends FieldValues {
  supplier_id: string;
  status: string;
  order_items: OrderItemInsert[];
}

interface OrderFormProps {
  initialData?: any;
  products: Product[];
  suppliers: Supplier[];
  onSubmit: (data: OrderFormValues) => void;
  onCancel: () => void;
  isNewOrder: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({ initialData, products, suppliers, onSubmit, onCancel, isNewOrder }) => {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<OrderFormValues>({
    defaultValues: {
      supplier_id: initialData?.supplier_id || '',
      status: initialData?.status || 'pending',
      order_items: initialData?.order_items || [{ product_id: '', quantity: 1, unit_price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'order_items',
  });

  const watchOrderItems = watch('order_items');

  const totalAmount = watchOrderItems.reduce((acc: number, current: OrderItemInsert) => {
    const quantity = Number(current.quantity) || 0;
    const price = Number(current.unit_price) || 0;
    return acc + quantity * price;
  }, 0);

  // Helper to render error messages
  const renderError = (error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined): ReactNode => {
    if (!error) return null;
    return <p className="text-red-500 text-sm mt-1">{error.message}</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supplier Selection */}
        <div>
          <Label htmlFor="supplier_id">Fournisseur</Label>
          <Controller
            name="supplier_id"
            control={control}
            rules={{ required: 'Le fournisseur est requis' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un fournisseur" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {renderError(errors.supplier_id)}
        </div>

        {/* Status Selection */}
        <div>
          <Label htmlFor="status">Statut</Label>
          <Controller
            name="status"
            control={control}
            rules={{ required: 'Le statut est requis' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="completed">Complétée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {renderError(errors.status)}
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Articles de la commande</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-md">
            {/* Product */}
            <div className="col-span-5">
              <Label>Produit</Label>
              <Controller
                name={`order_items.${index}.product_id`}
                control={control as Control<OrderFormValues>}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Quantity */}
            <div className="col-span-2">
              <Label>Quantité</Label>
              <Input
                type="number"
                {...register(`order_items.${index}.quantity`, { required: true, valueAsNumber: true, min: 1 })}
              />
            </div>

            {/* Unit Price */}
            <div className="col-span-3">
              <Label>Prix Unitaire</Label>
              <Input
                type="number"
                step="0.01"
                {...register(`order_items.${index}.unit_price`, { required: true, valueAsNumber: true, min: 0 })}
              />
            </div>
            
            {/* Remove Button */}
            <div className="col-span-2 flex justify-end">
              <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ product_id: '', quantity: 1, unit_price: 0, order_id: '', id: '' })}
        >
          Ajouter un article
        </Button>
      </div>
      
      {/* Total Amount & Actions */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div>
          <span className="text-lg font-bold">Total :</span>
          <span className="text-xl font-bold ml-2">{totalAmount.toFixed(2)} €</span>
        </div>
        <div className="flex space-x-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button>
          <Button type="submit">{isNewOrder ? 'Créer la commande' : 'Mettre à jour'}</Button>
        </div>
      </div>
    </form>
  );
};

export default OrderForm;
