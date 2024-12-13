"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'react-hot-toast';

interface BaseItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

interface BaseItemManagerProps {
  collectionName: string;
  AddModal: React.ComponentType<any>;
  EditModal: React.ComponentType<any>;
  columns: { key: string; label: string }[];
}

export function BaseItemManager({ 
  collectionName, 
  AddModal, 
  EditModal,
  columns 
}: BaseItemManagerProps) {
  const [items, setItems] = useState<BaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BaseItem | null>(null);

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const fetchedItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BaseItem[];
      setItems(fetchedItems);
    } catch (error) {
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [collectionName]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        toast.success('Item deleted successfully');
        fetchItems();
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleEdit = (item: BaseItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow max-w-4xl mx-auto">
        <div className="flex justify-between items-center sticky top-0 bg-white p-4 border-b">
          <h3 className="text-xl font-semibold capitalize">{collectionName}</h3>
          <Button onClick={() => setIsAddModalOpen(true)}>
            Add New {collectionName.slice(0, -1)}
          </Button>
        </div>

        <div className="h-[500px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className="font-semibold">
                    {column.label}
                  </TableHead>
                ))}
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <TableCell key={`${item.id}-${column.key}`} className="py-3">
                      {column.key === 'price' ? (
                        `$${Number(item[column.key]).toFixed(2)}`
                      ) : typeof item[column.key as keyof BaseItem] === 'boolean' ? (
                        item[column.key as keyof BaseItem] ? 'Yes' : 'No'
                      ) : (
                        item[column.key as keyof BaseItem]
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchItems();
        }}
      />

      {selectedItem && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
            fetchItems();
          }}
          item={selectedItem}
        />
      )}
    </div>
  );
} 