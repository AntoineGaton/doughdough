"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc, getDoc, query, where } from 'firebase/firestore';
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
  description?: string;
  image?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
  title?: string;
  discount?: string;
  price?: number;
  isActive?: boolean;
  featured?: boolean;
  terms?: string;
}

interface BaseItemManagerProps<T extends BaseItem> {
  collectionName: string;
  AddModal: React.ComponentType<any>;
  EditModal: React.ComponentType<any>;
  columns: { key: keyof T; label: string }[];
}

export function BaseItemManager<T extends BaseItem>({ 
  collectionName, 
  AddModal, 
  EditModal,
  columns 
}: BaseItemManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const fetchedItems = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Document ID:', doc.id, 'Document data:', data);
        return {
          ...data,
          id: doc.id,
          category: data.category
        } as T;
      });
      console.log('Fetched items with IDs:', fetchedItems);
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
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

  const handleUpdate = async (id: string, updatedData: Partial<T>) => {
    try {
      console.log('Attempting to update document with ID:', id);
      const docRef = doc(db, collectionName, id);
      
      await updateDoc(docRef, {
        ...updatedData,
        updatedAt: new Date()
      });
      
      toast.success('Item updated successfully');
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  const handleEdit = async (item: T) => {
    try {
      // Query for the document using name
      const q = query(
        collection(db, collectionName), 
        where("name", "==", item.name)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        toast.error('Item not found');
        return;
      }

      // Get the actual document with Firestore ID
      const actualDoc = querySnapshot.docs[0];
      const itemWithCorrectId = {
        ...item,
        id: actualDoc.id  // Use the actual Firestore document ID
      };

      console.log('Found document with ID:', actualDoc.id);
      setSelectedItem(itemWithCorrectId);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error preparing item for edit:', error);
      toast.error('Failed to prepare item for editing');
    }
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
        <div className="flex justify-between items-center sticky top-0 bg-secondary p-4 border-b bg-secondary">
          <h3 className="text-xl font-semibold capitalize text-primary ml-2">{collectionName}</h3>
          <Button onClick={() => setIsAddModalOpen(true)}>
            Add New {collectionName.slice(0, -1)}
          </Button>
        </div>

        <div className="h-[500px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={String(column.key)} className="font-semibold">
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
                    <TableCell key={`${item.id}-${String(column.key)}`} className="py-3">
                      {(column.key === 'image' ? (
                        item[column.key] ? (
                          <img 
                            src={String(item[column.key])} 
                            alt={String(item.name)} 
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : 'No image'
                      ) : item[column.key]) as React.ReactNode}
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
          onSuccess={(updatedData: Partial<T>) => {
            if (selectedItem?.id) {
              handleUpdate(selectedItem.id, updatedData);
              setIsEditModalOpen(false);
              setSelectedItem(null);
            }
          }}
          item={selectedItem}
        />
      )}
    </div>
  );
} 