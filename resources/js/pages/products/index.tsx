import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Produk', href: '/products' }];

const rupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function ProductsIndex({ products }: { products: Product[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        stock: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/products', { onSuccess: () => reset() });
    }

    function remove(id: number) {
        if (confirm('Hapus produk ini?')) {
            router.delete(`/products/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produk" />
            <div className="flex flex-col gap-6 p-4">
                <form onSubmit={submit} className="grid gap-4 rounded-xl border p-4 md:grid-cols-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="price">Harga</Label>
                        <Input id="price" type="number" value={data.price} onChange={(e) => setData('price', e.target.value)} />
                        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="stock">Stok</Label>
                        <Input id="stock" type="number" value={data.stock} onChange={(e) => setData('stock', e.target.value)} />
                        {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                    </div>
                    <div className="flex items-end">
                        <Button type="submit" disabled={processing}>
                            Tambah Produk
                        </Button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-3">Nama</th>
                                <th className="p-3">Harga</th>
                                <th className="p-3">Stok</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="p-3">{p.name}</td>
                                    <td className="p-3">{rupiah(p.price)}</td>
                                    <td className="p-3">{p.stock}</td>
                                    <td className="p-3 text-right">
                                        <Button variant="destructive" size="sm" onClick={() => remove(p.id)}>
                                            Hapus
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-6 text-center text-muted-foreground">
                                        Belum ada produk.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}