// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Card, CardBody, CardHeader, Modal, useModal, Autocomplete, useDisclosure, ModalContent, ModalHeader, ModalBody, ModalFooter, AutocompleteItem} from '@nextui-org/react';
import { DateTime } from 'luxon';
import { jalaaliToDateTime, dateTimeToJalaali } from '../../utils/jalaali';
import withAdminAuth from '../../components/withAdminAuth';
import {addFood,getFoods,getMeals,saveMeal} from '@/services/api';

interface Food {
  id: number;
  name: string;
  description: string;
  picture: string;
}

interface Meal {
  date: string;
  food: Food | null;
  rating: number;
}

const AdminPage = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [newFoodName, setNewFoodName] = useState('');
  // const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchFoods = async () => {
      const fetchedFoods = await getFoods();
      
      setFoods(fetchedFoods);
    };

    const fetchMeals = async () => {
      const today = DateTime.now();
      const next7Days = Array.from({ length: 7 }, (_, i) => dateTimeToJalaali(DateTime.fromISO(today.plus({ days: i }).toISODate())));
      const fetchedMeals = await getMeals();
      console.log('fetched meals',fetchedMeals)
      const mealsData = next7Days.map(date => ({
        date,
        food: fetchedMeals.find((meal: Meal) => meal.date === date)?.food || null,
        rating: fetchedMeals.find((meal: Meal) => meal.date === date)?.rating || 0,
      }));
      setMeals(mealsData);
      console.log('meals',mealsData)
    };

    fetchFoods();
    fetchMeals();
  }, []);

  // const handleSelectFood = (meal: Meal,food: Food) => {

  //   setSelectedFood(food);
  // };

  const handleAddFood = async () => {
    const newFood = await addFood({ name: newFoodName, description: '', picture: '' });
    setFoods([...foods, newFood]);
    // setSelectedFood(newFood);
    //add food to meal

    onClose();
  };
 const handleSelectFood = (meal: Meal,food: Food) => {
  console.log('set food for meal',meal,food)
    setMeals(meals.map(m => (m.date === meal.date ? { ...m, food: food } : m)));
  }

 
  const handleSaveMeal = async (meal:Meal) => {
      console.log(meal);
      await saveMeal({ date: meal.date, foodId: meal.food?.id || 0 });
      // setMeals(meals.map(m => (meal.date === m.date ? { ...m, food: meal.food } : m)));
    
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Set Meals for Next 7 Days</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {
        
        meals.map(meal => (
        
          <Card key={meal.date}>
            <CardHeader>
              <h4 className="text-xl font-medium">{meal.date}</h4>
            </CardHeader>
            <CardBody>
            <Autocomplete label="Food"    onSelectionChange={(selectedKey) => {
              const selectedFood = foods.find(food => food.id === Number(selectedKey));
              if (selectedFood) {
                handleSelectFood(meal, selectedFood);
              }
            }}
            defaultSelectedKey={meal.food?.id.toString() || ''}

            >

            {foods.map((food:Food) => (
                    <AutocompleteItem key={food.id} value={food.name}>
                    {food.name}

                    </AutocompleteItem>
            ))}
            </Autocomplete>

              <Button onPress={onOpen} className="mt-2">Add New Food</Button>
              <Button onPress={() => handleSaveMeal(meal)} className="mt-2">Save</Button>
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
          <Button  onPress={()=>{handleAddFood}}>
            Add
          </Button>
        </ModalFooter>

</ModalContent>
      </Modal>
    </div>
  );
};

export default withAdminAuth(AdminPage);
