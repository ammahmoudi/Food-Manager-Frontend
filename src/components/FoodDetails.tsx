import { FC } from 'react';
import { Avatar,Link,Image } from '@nextui-org/react';
import { FoodDetailsData } from '../interfaces/FoodDetailsData';

const StarIcon: FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const FoodDetails: FC<{ data: FoodDetailsData }> = ({ data }) => {
  const { imageUrl, title, description, rating, datePosted, comments, meals } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <Image
            src={imageUrl}
            alt="Food Image"
            width={600}
            height={400}
            className="w-full rounded-lg object-cover"
          />
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} filled={i < rating} />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">({rating})</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Posted on {datePosted}</div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        <div className="space-y-8">
          {comments.map((comment, index) => (
            <div key={index} className="flex gap-4">
              <Avatar className="w-10 h-10 border" src={comment.user.user_image as string} name={comment.user.full_name} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{comment.meal.food?.name}</div>
                  <time className="text-muted-foreground text-sm">{comment.createdAt}</time>
                </div>
                <p className="text-muted-foreground">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Meals with this Food</h2>
        <div className="space-y-8">
          {meals.map((meal, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{meal.date}</div>
                  <div className="flex items-center gap-0.5">
                    <StarIcon filled={true} />
                    <span className="text-muted-foreground text-sm">({meal.rating})</span>
                  </div>
                  <Link href={`/meals/${meal.date}`}>
                    <p className="text-blue-500 hover:underline">View Meal</p>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
