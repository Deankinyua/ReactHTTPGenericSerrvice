import { useEffect, useState } from 'react';

interface Props {
  category: string;
}

const ProductsList = ({ category }: Props) => {
  const [products, setProducts] = useState<string[]>([]);

  useEffect(() => {
    console.log('Fetching Products in ', category);
    setProducts(['Avocado', 'Mango']);
  }, [category]);
  return <div>Product List</div>;
};

export default ProductsList;
