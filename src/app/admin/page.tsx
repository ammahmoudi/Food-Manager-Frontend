// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Card, CardBody, CardHeader, Modal, useModal, Autocomplete, useDisclosure, ModalContent, ModalHeader, ModalBody, ModalFooter, AutocompleteItem} from '@nextui-org/react';
import { DateTime } from 'luxon';
import { jalaaliToDateTime, dateTimeToJalaali } from '../../utils/jalaali';
import withAdminAuth from '../../components/withAdminAuth';
import {addFood, getFeedbacks,getFoods,getMeals,saveMeal} from '@/services/api';

interface Food {
  id: number;
  name: string;
  description: string;
  picture: string;
}

interface Meal {
  date: string;
  food: Food | null;
}

const AdminPage = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [newFoodName, setNewFoodName] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchFoods = async () => {
      const fetchedFoods = await getFoods();
      
      setFoods(fetchedFoods);
    };

    const fetchMeals = async () => {
      const today = DateTime.now();
      const next7Days = Array.from({ length: 7 }, (_, i) => today.plus({ days: i }).toISODate());
      const fetchedMeals = await getMeals();
      const mealsData = next7Days.map(date => ({
        date,
        food: fetchedMeals.find((meal: Meal) => meal.date === date)?.food || null,
      }));
      setMeals(mealsData);
    };

    fetchFoods();
    fetchMeals();
  }, []);

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
  };

  const handleAddFood = async () => {
    const newFood = await addFood({ name: newFoodName, description: '', picture: '' });
    setFoods([...foods, newFood]);
    setSelectedFood(newFood);
    onClose();
  };

  const handleSaveMeal = async (date: string) => {
    if (selectedFood) {
      await saveMeal({ date, foodId: selectedFood.id });
      setMeals(meals.map(meal => (meal.date === date ? { ...meal, food: selectedFood } : meal)));
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Set Meals for Next 7 Days</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meals.map(meal => (
          <Card key={meal.date}>
            <CardHeader>
              <h4 className="text-xl font-medium">{dateTimeToJalaali(DateTime.fromISO(meal.date))}</h4>
            </CardHeader>
            <CardBody>
            <Autocomplete>

            {foods.map((food:Food) => (
                    <AutocompleteItem key={food.id} value={food.name}>
                    {food.name}

                    </AutocompleteItem>
            ))}
            </Autocomplete>

              <Button onPress={onOpen} className="mt-2">Add New Food</Button>
              <Button onPress={() => handleSaveMeal(meal.date)} className="mt-2">Save</Button>
            </CardBody>
          </Card>
        ))}
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>

<ModalContent>
<ModalHeader>
          <h4 className="text-xl font-medium">Add New Food</h4>
        </ModalHeader>
        <ModalBody>
          <Input
            
            placeholder="Food Name"
            value={newFoodName}
            onChange={(e) => setNewFoodName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button  onPress={handleAddFood}>
            Add
          </Button>
        </ModalFooter>

</ModalContent>
      </Modal>
    </div>
  );
};

export default withAdminAuth(AdminPage);
