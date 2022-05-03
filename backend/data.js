import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Friday',
      password: bcrypt.hashSync('24262426'),
      isAdmin: true,
    },
    {
      name: 'Joe',
      email: 'bitdoctrine@gmail.com',
      password: bcrypt.hashSync('friday.2'),
      isAdmin: false,
    },
  ],
  products: [
    {
      // _id: '1',
      name: 'Fluffy Bag',
      slug: 'fluffy-bag',
      category: 'shoes',
      image: '/images/p3.jpg',
      price: 5000,
      countInStock: 10,
      brand: 'Gucci',
      rating: 3.0,
      numReviews: 10,
      description: 'A sweet comfortable bag for you outing and all',
    },
    {
      // _id: '2',
      name: 'Boaling Boot',
      slug: 'boaling-boot',
      category: 'shoes',
      image: '/images/p1.jpg',
      price: 24000,
      countInStock: 0,
      brand: 'Prada',
      rating: 5.0,
      numReviews: 10,
      description: 'A nice boaling boot for your comfortable boaling',
    },
    {
      // _id: '3',
      name: 'Umbrella',
      slug: 'umbrella',
      category: 'umbrellas',
      image: '/images/p2.jpg',
      price: 24000,
      countInStock: 10,
      brand: 'Umbrella Coporation',
      rating: 4.0,
      numReviews: 15,
      description: 'You have never seen a better umbrella',
    },
    {
      // _id: '4',
      name: 'Adidas Fit Pant',
      slug: 'addidas-fit-pant',
      category: 'Wears',
      image: '/images/p4.jpg',
      price: 10000,
      countInStock: 15,
      brand: 'Puma',
      rating: 4.0,
      numReviews: 18,
      description: 'comfie adidas fit pant for you maximum comfort',
    },
  ],
};

export default data;
