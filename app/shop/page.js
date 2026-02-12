"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  FiShoppingCart,
  FiSearch,
  FiGrid,
  FiList,
  FiFilter,
  FiChevronRight,
  FiX,
  FiStar,
} from "react-icons/fi";

export const allProducts = [
  // --- Dairy ---
  {
    id: 10,
    name: "Amul Butter (500GM)",
    price: 275,
    oldPrice: 290,
    unit: "500 GM",
    description:
      "Amul Butter is the classic choice for millions of Indian households, known for its rich, creamy taste and unmistakable saltiness. It is perfect for spreading on hot toast, melting over parathas, or adding a savory depth to your favorite recipes. Made from the finest quality milk, it provides a consistent flavor and texture that characterizes traditional breakfast. Use it in baking, sautéing, or as a finishing touch to many dishes.",
    vendor: "Amul",
    category: "Dairy",
    discount: "5%",
    rating: 4.4,
    img: "https://www.jiomart.com/images/product/original/490001392/amul-pasteurised-butter-500-g-product-images-o490001392-p490001392-0-202508291839.jpg?im=Resize=(420,420)",
  },
  {
    id: 24,
    name: "Heritage Toned Milk (1LTR)",
    price: 64,
    oldPrice: 68,
    unit: "1 LTR",
    description:
      "Heritage Toned Milk is a high-quality nutritional choice for families seeking fresh and healthy cow milk. It is processed with care to maintain the perfect balance of taste and nutrition while being light on the stomach. Ideal for daily tea, coffee, or as a healthy beverage for children, it provides essential calcium and vitamins for overall growth. This milk is pasteurized and packaged under hygienic conditions to ensure purity and long-lasting freshness.",
    vendor: "Heritage",
    category: "Dairy",
    discount: "6%",
    rating: 4.4,
    img: "https://www.jiomart.com/images/product/original/494271401/heritage-golden-cow-milk-1-l-pouch-product-images-o494271401-p610079697-0-202410071813.jpg?im=Resize=(420,420)",
  },
  {
    id: 40,
    name: "Amul Fresh Paneer (200GM)",
    price: 85,
    oldPrice: 95,
    unit: "200 GM",
    description:
      "Amul Fresh Paneer is synonymous with purity and softness, making it a favorite for Indian curries and snacks. It is made from fresh milk and is packed using advanced technology to retain its texture and flavor for longer periods. Whether you are making Paneer Tikka, Palak Paneer, or a simple stir-fry, it absorbs flavors beautifully while remaining tender. It is a rich source of protein and calcium, making it an excellent addition to a balanced vegetarian diet.",
    vendor: "Amul",
    category: "Dairy",
    discount: "11%",
    rating: 4.5,
    img: "https://m.media-amazon.com/images/I/81hD14MN91L._SX679_.jpg",
  },
  {
    id: 41,
    name: "Mother Dairy Curd (400GM)",
    price: 35,
    oldPrice: 40,
    unit: "400 GM",
    description:
      "Mother Dairy Curd is thick, creamy, and consistently smooth, providing a homelike taste with every spoonful. It is prepared in a controlled environment with specific cultures to ensure the perfect level of tanginess and texture. Excellent for making lassi, raita, or simply as a refreshing side dish with your meals, it aids digestion and provides essential gut-friendly bacteria. It is a healthy and natural way to cool down during the hot summer months.",
    vendor: "Mother Dairy",
    category: "Dairy",
    discount: "13%",
    rating: 4.1,
    img: "https://www.bigbasket.com/media/uploads/p/l/40006900_4-mother-dairy-ultimate-pouch-curd.jpg",
  },
  {
    id: 42,
    name: "Amul Cheese Slices (200GM)",
    price: 155,
    oldPrice: 165,
    unit: "200 GM",
    description:
      "Amul Cheese Slices offer a convenient way to add the rich and savory flavor of processed cheese to your snacks. Each slice is individually wrapped to maintain freshness and melt-in-the-mouth consistency when heated. They are perfect for preparing quick grilled cheese sandwiches, topping burgers, or adding a creamy layer to wraps and salads. Made from high-quality milk, these slices are a quick and tasty source of energy and protein for kids and adults alike.",
    vendor: "Amul",
    category: "Dairy",
    discount: "6%",
    rating: 4.6,
    img: "https://www.bbassets.com/media/uploads/p/l/104808_9-amul-cheese-slices.jpg",
  },

  // --- Fruits ---
  {
    id: 43,
    name: "Fresh Banana (Robusta)",
    price: 45,
    oldPrice: 60,
    unit: "6 PCS",
    description:
      "Our Robusta Bananas are sourced from the finest farms, ensuring you get the perfect balance of sweetness and nutrition. Each banana is packed with potassium, fiber, and essential vitamins, making it an ideal pre-workout snack or a quick energy booster. These bananas are carefully picked at the peak of freshness and delivered to your doorstep to ensure maximum quality. They are versatile and can be used in smoothies, desserts, or enjoyed right out of the peel.",
    vendor: "Quickzy Fresh",
    category: "Fruits",
    discount: "25%",
    rating: 4.3,
    img: "https://www.bbassets.com/media/uploads/p/l/10000025-5_7-fresho-banana-robusta.jpg",
  },
  {
    id: 44,
    name: "Fresh Apple (Royal Gala)",
    price: 180,
    oldPrice: 220,
    unit: "1 KG",
    description:
      "Royal Gala Apples are prized for their beautiful thin skin and sweet, crunchy flesh that makes them a perfect snack for any time of day. Sourced from high-altitude orchards, these apples are rich in antioxidants and dietary fiber, promoting heart health and overall well-being. Their refreshing taste and crisp texture make them a popular choice for salads, baking, or just eating raw. We ensure that only the highest quality, bruise-free apples are selected for your order.",
    vendor: "Quickzy Fresh",
    category: "Fruits",
    discount: "18%",
    rating: 4.7,
    img: "https://m.media-amazon.com/images/I/51fWm14UXiL._AC_UL640_FMwebp_QL65_.jpg",
  },
  {
    id: 45,
    name: "Fresh Orange (Imported)",
    price: 120,
    oldPrice: 150,
    unit: "1 KG",
    description:
      "Our imported oranges are exceptionally juicy and sweet, offering a vibrant burst of citrus flavor in every bite. They are an excellent natural source of Vitamin C, which is pivotal for maintaining a robust immune system and healthy skin. These oranges are perfect for squeezing into fresh morning juice or adding a refreshing touch to your fruit platters. Every orange is hand-selected to ensure it is plump, heavy for its size, and free from any external blemishes.",
    vendor: "Quickzy Fresh",
    category: "Fruits",
    discount: "20%",
    rating: 4.4,
    img: "https://m.media-amazon.com/images/I/51AwUoy+upL._SX679_.jpg",
  },
  {
    id: 46,
    name: "Fresh Grapes (Seedless)",
    price: 90,
    oldPrice: 110,
    unit: "500 GM",
    description:
      "Seedless Grapes are the perfect no-mess snack, known for their sweet, juicy interior and satisfying snap when you bite into them. These grapes are rich in natural sugars and vitamins, providing a healthy way to satisfy your sweet tooth throughout the day. They are ideal for packing in lunchboxes, serving at parties, or adding to a variety of sweet and savory dishes. We source these from farms that prioritize quality, ensuring you receive firm and fresh bunches every time.",
    vendor: "Quickzy Fresh",
    category: "Fruits",
    discount: "18%",
    rating: 4.5,
    img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=480,h=480/da/cms-assets/cms/product/9d74a4f6-8bb6-472d-82a4-29d80cc719fd.jpg",
  },
  {
    id: 47,
    name: "Fresh Pomegranate",
    price: 160,
    oldPrice: 200,
    unit: "1 KG",
    description:
      "Pomegranates are a superfood known for their vibrant red seeds that are packed with powerful antioxidants and anti-inflammatory properties. Each fruit is a treasure trove of juicy, tangy sweet arils that can enhance the flavor and health quotient of any meal. They are perfect for topping yogurt or oatmeal, adding to salads, or enjoying as a standalone refreshing snack. We select pomegranates that are heavy and firm, ensuring you get the maximum amount of juice and nutrtion.",
    vendor: "Quickzy Fresh",
    category: "Fruits",
    discount: "20%",
    rating: 4.8,
    img: "https://m.media-amazon.com/images/I/41SN44--WKL._AC_UL640_FMwebp_QL65_.jpg",
  },

  // --- Vegetables ---
  {
    id: 48,
    name: "Fresh Tomato (Local)",
    price: 30,
    oldPrice: 40,
    unit: "1 KG",
    description:
      "Our local tomatoes are farm-fresh, ensuring you get the authentic flavor and juiciness required for daily Indian cooking. They are harvested daily and delivered quickly to maintain their firmness and bright red color. Perfect for base gravies, tangy chutneys, or fresh salads, these tomatoes are a rich source of Vitamin C and Lycopene. We ensure only the best quality, undamaged tomatoes reach your kitchen for a healthy and tasty meal experience.",
    vendor: "Quickzy Fresh",
    category: "Vegetables",
    discount: "25%",
    rating: 4.2,
    img: "https://www.bbassets.com/media/uploads/p/l/10000203-5_2-fresho-tomato-local.jpg",
  },
  {
    id: 49,
    name: "Fresh Onion (Nashik)",
    price: 40,
    oldPrice: 50,
    unit: "1 KG",
    description:
      "Sourced directly from Nashik, these onions are famous for their pungent flavor and long shelf life, making them a kitchen staple. They are the essential starting point for almost every savory dish, providing a deep base of flavor when sautéed or fried. These onions are carefully cured and graded to ensure you receive only firm, dry bulbs that are ready for use. Rich in sulfur and antioxidants, they add both flavor and significant health benefits to your daily diet.",
    vendor: "Quickzy Fresh",
    category: "Vegetables",
    discount: "20%",
    rating: 4.6,
    img: "https://www.bigbasket.com/media/uploads/p/l/10000148_30-onion.jpg",
  },
  {
    id: 50,
    name: "Fresh Potato (New Crop)",
    price: 35,
    oldPrice: 45,
    unit: "1 KG",
    description:
      "New Crop Potatoes are appreciated for their thin skin and creamy, versatile flesh that is perfect for a wide range of recipes. Sourced from nutrient-rich soils, these potatoes are ideal for boiling, roasting, or mashing, providing a comforting and filling addition to any meal. They are high in complex carbohydrates and potassium, offering sustained energy for your daily activities. We pick only uniform, sprout-free potatoes to ensure ease of preparation and consistent quality.",
    vendor: "Quickzy Fresh",
    category: "Vegetables",
    discount: "22%",
    rating: 4.4,
    img: "https://www.bbassets.com/media/uploads/p/l/40320937-5_3-fresho-potato-fresh-crop.jpg",
  },
  {
    id: 51,
    name: "Fresh Cauliflower",
    price: 40,
    oldPrice: 60,
    unit: "1 PCS",
    description:
      "Our Cauliflower is known for its compact, snowy white curds and fresh, crunchy texture that stands up well to various cooking methods. It is a low-calorie alternative to grains and is incredibly rich in fiber and various essential vitamins. Whether you are roasting it with spices, making Gobi Manchurian, or using it in a traditional curry, it adds a delightful texture and mild flavor. We select heads that are heavy and free from spots, guaranteeing freshness and a long usage window.",
    vendor: "Quickzy Fresh",
    category: "Vegetables",
    discount: "33%",
    rating: 4.1,
    img: "https://www.bbassets.com/media/uploads/p/l/10000074-6_2-fresho-cauliflower.jpg",
  },
  {
    id: 52,
    name: "Fresh Spinach (Palak)",
    price: 20,
    oldPrice: 30,
    unit: "250 GM",
    description:
      "Our Spinach leaves are tender, vibrant, and packed with vitamins A, C, and K, as well as a significant amount of iron. Collected from hydroponic or high-quality farms, these greens are perfect for healthy smoothies, sautéed sides, or traditional Palak Paneer. Spinach is known for its high nutritional density and its ability to cook down into a delicious, nutrient-rich addition to many dishes. We ensure that our spinach is kept cool and delivered fresh to maintain its crispness and healthy green color.",
    vendor: "Quickzy Fresh",
    category: "Vegetables",
    discount: "33%",
    rating: 4.7,
    img: "https://www.bbassets.com/media/uploads/p/l/10000188-6_2-fresho-palak-cleaned-without-roots.jpg",
  },

  // --- Beverages ---
  {
    id: 7,
    name: "Coca Cola (1.25LTR)",
    price: 65,
    oldPrice: 75,
    unit: "1.25 LTR",
    description:
      "Coca-Cola is the world's favorite sparkling beverage, offering a unique, refreshing taste that has remained classic for generations. This 1.25L bottle is perfect for sharing with friends and family during meals or gatherings, providing a crisp burst of flavor. Best served ice-cold, it is the ultimate thirst quencher and a perfect companion for spicy snacks and savory meals. Enjoy the familiar fizz and the iconic taste of Coke, delivered straight to your door for your convenience.",
    vendor: "Coca Cola",
    category: "Beverages",
    discount: "13%",
    rating: 4.5,
    img: "https://www.bigbasket.com/media/uploads/p/l/251023_11-coca-cola-soft-drink.jpg",
  },
  {
    id: 17,
    name: "Nescafe Gold (50GM)",
    price: 320,
    oldPrice: 380,
    unit: "50 GM",
    description:
      "Nescafe Gold is a premium, freeze-dried soluble coffee that offers a smooth and sophisticated taste with a rich aroma. Crafted with a blend of Arabica and Robusta beans, it is roasted to perfection to bring out a distinctive depth of flavor. Ideal for those who enjoy a cafe-quality experience at home, it dissolves instantly to create a consistently perfect cup of coffee. The elegant glass jar preserves the aroma and freshness, ensuring that every cup is as good as the first one.",
    vendor: "Nescafe",
    category: "Beverages",
    discount: "15%",
    rating: 4.9,
    tag: "Best",
    img: "https://m.media-amazon.com/images/I/41O76L+6oDL._SY300_SX300_QL70_FMwebp_.jpg",
  },
  {
    id: 19,
    name: "Real Fruit Mixed (1LTR)",
    price: 110,
    oldPrice: 125,
    unit: "1 LTR",
    description:
      "Real Fruit Power Mixed Fruit is a delicious blend of nine exotic fruits, providing a rich source of vitamins and natural energy. It is made from high-quality fruit pulps without any added preservatives, ensuring you get the wholesome goodness of nature in every glass. Perfectly refreshing at any time of day, it is a great alternative to carbonated drinks for both kids and adults. Enjoy the balanced sweetness and the medley of fruit flavors that make this a favorite for healthy family breakfasts.",
    vendor: "Real",
    category: "Beverages",
    discount: "12%",
    rating: 4.1,
    img: "https://www.bigbasket.com/media/uploads/p/l/1204481_1-real-fruit-power-juice-mixed.jpg",
  },
  {
    id: 35,
    name: "Hershey's Chocolate Syrup",
    price: 185,
    oldPrice: 210,
    unit: "623 GM",
    description:
      "Hershey's Chocolate Syrup is the ultimate topping for ice creams, pancakes, and milkshakes, adding a rich and authentic cocoa flavor. It has a smooth, pourable consistency that makes it easy to drizzle over your favorite desserts or stir into warm milk for an instant hot cocoa. This iconic syrup is a household favorite for its consistent quality and the deep, chocolatey taste that enhances any sweet treat. The easy-to-use squeeze bottle ensures a mess-free experience for kids and parents alike.",
    vendor: "Hershey's",
    category: "Beverages",
    discount: "12%",
    rating: 4.3,
    img: "https://m.media-amazon.com/images/I/4196sepYxPL._SY300_SX300_QL70_FMwebp_.jpg",
  },

  // --- Snacks ---
  {
    id: 8,
    name: "Lay's Classic Salted",
    price: 20,
    oldPrice: 22,
    unit: "50 GM",
    description:
      "Lay's Classic Salted Potato Chips are made from farm-grown potatoes, sliced thin and fried to a perfect golden crisp. They are seasoned with just the right amount of salt, allowing the natural flavor of the potato to shine through in every bite. This snack is perfect for solo munching or sharing during parties and movie nights, offering a satisfying crunch that everyone loves. Each bag is nitro-flushed to preserve freshness and ensure that the chips arrive at your home in perfect condition.",
    vendor: "Lay's",
    category: "Snacks",
    discount: "10%",
    rating: 4.6,
    img: "https://m.media-amazon.com/images/I/41VxPV-rWsL._SY300_SX300_QL70_FMwebp_.jpg",
  },
  {
    id: 23,
    name: "Lindt Excellence Dark",
    price: 245,
    oldPrice: 315,
    unit: "100 GM",
    description:
      "Lindt Excellence Dark Chocolate is a masterpiece of Swiss chocolate craftsmanship, offering a deep and satisfying cocoa experience. Known for its smooth texture and balanced flavor profile, it melts elegantly on the tongue to reveal layers of rich dark cocoa notes. This bar is ideal for true chocolate aficionados who appreciate high-quality ingredients and a refined, lingering finish. Perfect for sharing after a meal or enjoying as a sophisticated treat during a quiet moment of relaxation.",
    vendor: "Lindt",
    category: "Snacks",
    discount: "22%",
    rating: 4.8,
    img: "https://m.media-amazon.com/images/I/51aFMIhl6TL._AC_UL640_FMwebp_QL65_.jpg",
  },
  {
    id: 25,
    name: "Parle-G Gold (1KG)",
    price: 120,
    oldPrice: 140,
    unit: "1 KG",
    description:
      "Parle-G Gold is a premium version of India's favorite glucose biscuit, offering more milk and honey for a richer and heartier taste. These biscuits have been a trusted source of energy and nutrition for generations, loved by children and adults alike when paired with tea. They are baked to golden perfection, providing a light yet satisfying crunch that is consistently delicious across every pack. This 1kg family pack ensures you have enough to go around for daily snacking and quick energy boosters.",
    vendor: "Parle",
    category: "Snacks",
    discount: "14%",
    rating: 4.7,
    img: "https://www.jiomart.com/images/product/original/491335633/parle-g-gold-biscuits-1-kg-product-images-o491335633-p491335633-0-202303221149.jpg?im=Resize=(420,420)",
  },
  {
    id: 27,
    name: "Britannia Cashew Cookies",
    price: 25,
    oldPrice: 30,
    unit: "150 GM",
    description:
      "Britannia Good Day Cashew Cookies are delightful butter-based biscuits generously studded with crunchy cashew nut pieces. They offer a rich, buttery aroma and a satisfyingly sweet taste that makes them the perfect companion for your evening tea or coffee. The light, crispy texture combined with the nuttiness of high-quality cashews provides a premium snacking experience in every bite. Perfect for satisfying mid-day hunger pangs or serving to guests as a classic and well-loved treat.",
    vendor: "Britannia",
    category: "Snacks",
    discount: "16%",
    rating: 4.3,
    img: "https://m.media-amazon.com/images/I/71zTGI0xIML._SX679_.jpg",
  },
  {
    id: 34,
    name: "Happilo Roasted Almonds",
    price: 245,
    oldPrice: 350,
    unit: "200 GM",
    description:
      "Happilo Roasted and Salted Almonds are a healthy and delicious snack choice for health-conscious individuals seeking a boost of energy. These premium almonds are expertly roasted to enhance their natural nuttiness and lightly seasoned for a perfect savory finish. They are a rich source of Vitamin E, magnesium, and healthy fats, promoting heart health and improved cognitive function. Perfect for carrying in your gym bag, office drawer, or keeping at home for a quick, nutrient-dense snacking option.",
    vendor: "Happilo",
    category: "Snacks",
    discount: "30%",
    rating: 4.7,
    img: "https://m.media-amazon.com/images/I/41jmDmSnwkL._SY300_SX300_QL70_FMwebp_.jpg",
  },
  {
    id: 53,
    name: "Haldiram's Bhujia (400GM)",
    price: 95,
    oldPrice: 110,
    unit: "400 GM",
    description:
      "Haldiram's Bhujia Sev is an iconic Indian snack made from spicy tepary bean and gram flour noodles, fried to a perfect crisp. Its unique blend of spices offers a savory and slightly tangy flavor profile that is addictive and satisfying at the same time. This bhujia is perfect as a standalone snack or can be used as a crunchy topping for chaats, salads, and traditional Indian meals. Made under stringent quality controls, it maintains its crunch and authentic taste for an extended period.",
    vendor: "Haldiram",
    category: "Snacks",
    discount: "14%",
    rating: 4.8,
    img: "https://www.bbassets.com/media/uploads/p/l/70000819_3-haldirams-namkeen-bhujia-del.jpg",
  },

  // --- Electronics ---
  {
    id: 1,
    name: "Apple Lightning Cable",
    price: 1499,
    oldPrice: 1900,
    unit: "1 PCS",
    description:
      "The Apple Lightning to USB Cable is an essential accessory for charging and syncing all your compatible Apple devices with efficiency. This durable 1-meter cable is built to high standards, ensuring a stable connection and fast data transfer speeds when connected to a computer or power adapter. It features a reversible design for effortless use and is compact enough to carry in your travel bag or pocket. Genuine Apple construction guarantees compatibility and safety for your expensive electronic devices.",
    tag: "Hot",
    vendor: "Apple",
    category: "Electronics",
    discount: "21%",
    rating: 4.3,
    img: "https://m.media-amazon.com/images/I/21ANdUsXdPL._SX342_SY445_QL70_FMwebp_.jpg",
  },
  {
    id: 2,
    name: "BoAt Bassheads 100",
    price: 399,
    oldPrice: 599,
    unit: "1 PCS",
    description:
      "BoAt Bassheads 100 wired earphones feature a unique hawk-inspired design that is stylish and provides a comfortable in-ear fit for long hours. Equipped with 10mm dynamic drivers, they deliver clear sound with powerful, super extra bass that brings your music to life. The integrated microphone with a multi-function button allows for easy hands-free calling and music control on the go. Its durable, tangle-free cable ensures a hassle-free experience whether you are commuting, working, or exercising.",
    tag: "Sale",
    vendor: "BoAt",
    category: "Electronics",
    discount: "33%",
    rating: 4.1,
    img: "https://m.media-amazon.com/images/I/313U7Xx9b4L._SY300_SX300_QL70_FMwebp_.jpg",
  },
  {
    id: 3,
    name: "Energizer MAX AA (4PK)",
    price: 299,
    oldPrice: 350,
    unit: "4 PCS",
    description:
      "Energizer MAX AA alkaline batteries are designed to provide long-lasting and reliable power to your frequently used household devices. They feature PowerSeal technology that protects your devices from damaging leaks for up to two years after they are fully used. These batteries are ideal for toys, remote controls, flashlights, and smoke detectors, ensuring your essentials are always ready when you need them. They can hold their power for up to 10 years in storage, making them a perfect choice for your emergency kits.",
    tag: "Best",
    vendor: "Energizer",
    category: "Gadgets",
    discount: "14%",
    rating: 4.7,
    img: "https://m.media-amazon.com/images/I/51WKnE4bvpL._SY300_SX300_QL70_FMwebp_.jpg",
  },
  {
    id: 22,
    name: "boAt Storm Smartwatch",
    price: 1999,
    oldPrice: 3999,
    unit: "1 PCS",
    description:
      "The boAt Watch Storm is the perfect companion for your fitness transformation, featuring a clear 1.3-inch curved display that is both elegant and durable. Its daily activity tracker and 9 different sports modes help you monitor your heart rate and oxygen levels with precision. With its 5ATM water resistance, you can wear it through sweat and splashes without any concern during your intense workouts. Long battery life ensures that you stay connected to your health goals for days on a single charge.",
    vendor: "BoAt",
    category: "Electronics",
    tag: "New",
    discount: "50%",
    rating: 4.6,
    img: "https://m.media-amazon.com/images/I/61S9aVnRZDL.jpg",
  },
  {
    id: 28,
    name: "Logitech B170 Mouse",
    price: 599,
    oldPrice: 899,
    unit: "1 PCS",
    description:
      "The Logitech B170 is a reliable wireless mouse that provides the freedom of wireless connectivity with a 10-meter range through a small USB receiver. Its compact and ambidextrous design makes it comfortable for both right and left-handed users during long working hours. It features advanced optical tracking for precise cursor control on almost any surface, enhancing your productivity in the office or on the road. With a battery life of up to 12 months, it is a low-maintenance and dependable choice for your computer setup.",
    vendor: "Logitech",
    category: "Electronics",
    discount: "33%",
    rating: 4.6,
    img: "https://m.media-amazon.com/images/I/51uCYJqDrML._SX679_.jpg",
  },
  {
    id: 37,
    name: "Sony WH-CH520 Headphones",
    price: 3990,
    oldPrice: 5990,
    unit: "1 PCS",
    description:
      "Sony WH-CH520 wireless on-ear headphones are designed for high-quality sound and impressive battery life, lasting up to 50 hours on a single charge. They feature a lightweight design and adjustable headband for a comfortable listening experience that stays snug throughout the day. With hands-free calling and multipoint connection, you can switch seamlessly between your phone and laptop for work or entertainment. Sony's Digital Sound Enhancement Engine ensures that your compressed music files sounds closer to the original recording.",
    vendor: "Sony",
    category: "Electronics",
    discount: "33%",
    rating: 4.8,
    img: "https://m.media-amazon.com/images/I/41PA8xgXx4L._AC_UY436_FMwebp_QL65_.jpg",
  },

  // --- Personal & Beauty ---
  {
    id: 4,
    name: "Nivea Men Face Wash",
    price: 185,
    oldPrice: 210,
    unit: "100 ML",
    description:
      "Nivea Men Dark Spot Reduction Face Wash effectively reduces dark spots and accumulated dullness for a brighter and cleaner look. Its effective formula with Vitamin C and Ginkgo helps to control oiliness and leaves your skin feeling refreshed and energized after every wash. Specially developed for male skin, it deeply cleanses pores without drying out the skin, making it suitable for daily use in your grooming routine. Experience visible clarity and a smoother skin texture with consistent use.",
    vendor: "Nivea",
    category: "Personal Care",
    discount: "12%",
    rating: 4.4,
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ0W4YGyIeHyvdg7KaIXIzHbTxcVT4nwviIH2JrzF0nDK26Ope46NqSr5c_2GsGAAvWnjp2-e5QrNNWoVVTGix1xBYUZzs991zfyghM9kwJiXCnMB-ojsimEg",
  },
  {
    id: 5,
    name: "Dove Intense Repair",
    price: 450,
    oldPrice: 520,
    unit: "650 ML",
    description:
      "Dove Intense Repair Shampoo is enriched with fiber actives that penetrate deep into the hair to nourish and help repair damaged strands from within. Designed for hair that is prone to breakage and split ends, it progressively strengthens your hair and makes it more resilient against daily damage. It leaves your hair feeling remarkably smooth, shiny, and manageable after every wash, making it ideal for daily hair care. Enjoy the classic and mild Dove scent that stays with you, giving a clean and fresh feeling all day.",
    vendor: "Dove",
    category: "Beauty",
    discount: "13%",
    rating: 4.2,
    img: "https://m.media-amazon.com/images/I/31J9B3A8rIL._SY300_SX300_QL70_FMwebp_.jpg",
  },
  {
    id: 20,
    name: "Wild Stone Deodorant",
    price: 245,
    oldPrice: 299,
    unit: "150 ML",
    description:
      "Wild Stone Ultra Sensual Deodorant for men offers an irresistibly masculine fragrance that is perfect for office wear or special evenings. Its unique blend of spicy and aromatic notes provides long-lasting freshness and effectively neutralizes body odor throughout the day's activities. The spray bottle provides a fine mist that covers well and dries quickly, leaving a confident trail of scent behind you. Experience a boost of self-confidence with this premium fragrance that is crafted for the modern, active man.",
    vendor: "Wild Stone",
    category: "Grooming",
    discount: "18%",
    rating: 4.5,
    img: "https://m.media-amazon.com/images/I/611dsNJJjBL._AC_UL640_FMwebp_QL65_.jpg",
  },

  // --- Household ---
  {
    id: 14,
    name: "Surf Excel Matic (1LTR)",
    price: 240,
    oldPrice: 280,
    unit: "1 LTR",
    description:
      "Surf Excel Matic Liquid is specially formulated for front and top-loading washing machines, providing superior stain removal in only one wash. Its advanced liquid formula dissolves instantly in the wash cycle, ensuring no residue is left on your clothes or inside the machine. It is tough on stains but gentle on colors, maintaining the vibrancy of your favorite fabrics for a longer time. The concentrated liquid provides a pleasant fragrance to your laundry, leaving your clothes smelling clean and fresh for days.",
    tag: "Hot",
    vendor: "Surf Excel",
    category: "Household",
    discount: "14%",
    rating: 4.8,
    img: "https://m.media-amazon.com/images/I/616ZqasKGuL.jpg",
  },
  {
    id: 31,
    name: "Kitchen Essentials Pan",
    price: 845,
    oldPrice: 950,
    unit: "1 PCS",
    description:
      "The Kitchen Essentials Non-Stick Frying Pan is a must-have for every modern kitchen, designed for healthy cooking with minimal oil. Its durable multi-layer non-stick coating ensures smooth food release and easy cleanup, making it perfect for everyday use. Featuring an ergonomically designed stay-cool handle, it provides a safe and comfortable grip even when the pan is hot on the stove. This versatile pan is ideal for frying eggs, making omelets, or sautéing vegetables, ensuring even heat distribution for consistent results.",
    vendor: "Kitchen Essentials",
    category: "Household",
    discount: "11%",
    rating: 4.8,
    img: "https://m.media-amazon.com/images/I/61VlNDf-RgL._AC_UL640_FMwebp_QL65_.jpg",
  },
  {
    id: 32,
    name: "Milton Bottle (1LTR)",
    price: 445,
    oldPrice: 550,
    unit: "1 PCS",
    description:
      "Milton Pet Bottles offer a convenient and stylish way to carry your water and beverages, whether you are at the gym, office, or school. Made from high-quality, BPA-free food-grade plastic, they are safe for daily use and are designed to be durable and leak-proof. The 1-liter capacity is perfect for staying hydrated throughout the day, while the slender design fits comfortably in most car cup holders and bags. Available in vibrant colors, these bottles are easy to clean and maintain, providing a reliable hydration solution.",
    vendor: "Milton",
    category: "Household",
    discount: "19%",
    rating: 4.4,
    img: "https://m.media-amazon.com/images/I/31e+tH1FKML._SY300_SX300_QL70_FMwebp_.jpg",
  },
  {
    id: 38,
    name: "Milton ThermoSteel Flask",
    price: 845,
    oldPrice: 1050,
    unit: "1 PCS",
    description:
      "The Milton ThermoSteel Flask is designed with double-wall vacuum insulation that keeps your hot beverages hot and cold ones cold for up to 24 hours. Made from high-grade stainless steel both on the inside and outside, it is built to withstand domestic use and outdoor adventures alike. Its sleek and portable design features a leak-proof cap that can also be used as a convenient cup for drinking on the go. Ideal for travel, office, or bedside use, it ensures that your favorite drinks are at the perfect temperature anytime.",
    vendor: "Milton",
    category: "Household",
    discount: "19%",
    rating: 4.4,
    img: "https://m.media-amazon.com/images/I/41lTfXSregL._SY300_SX300_QL70_FMwebp_.jpg",
  },
  {
    id: 54,
    name: "Lizol Floor Cleaner (500ML)",
    price: 105,
    oldPrice: 120,
    unit: "500 ML",
    description:
      "Lizol Disinfectant Surface Cleaner is India's No. 1 floor cleaning brand, trusted to kill 99.9% of germs and leave your home sparkling clean. Its powerful formula effectively removes tough stains like grease and coffee while providing 10 times better germ protection than ordinary cleaners. Suitable for all types of floors including tiles, marble, and granite, it leaves a pleasant and lasting citrus fragrance after every use. Regular use ensures a hygienic and safe environment for your family and pets to live in comfortably.",
    vendor: "Lizol",
    category: "Household",
    discount: "12%",
    rating: 4.3,
    img: "https://m.media-amazon.com/images/I/41z6fPCNDvL._SY300_SX300_QL70_FMwebp_.jpg",
  },

  // --- Grocery ---
  {
    id: 9,
    name: "Aashirvaad Atta (5KG)",
    price: 245,
    oldPrice: 280,
    unit: "5 KG",
    description:
      "Aashirvaad Whole Wheat Atta is made from the finest quality wheat grains sourced from selected amber-colored wheat fields across India. The grains are cleaned using a 3-step mechanized process and ground using traditional stone-grinding technology to retain natural nutrition and fiber. This results in soft, fluffy, and delicious rotis that stay fresh for a longer time, providing a wholesome meal for your family every day. Our 'Purity through tradition' promise ensures that you get 100% pure atta with zero adulteration.",
    vendor: "ITC",
    category: "Grocery",
    discount: "12%",
    rating: 4.9,
    img: "https://www.bigbasket.com/media/uploads/p/l/126906_8-aashirvaad-atta-whole-wheat.jpg",
  },
  {
    id: 26,
    name: "Saffola Gold (5LTR)",
    price: 845,
    oldPrice: 950,
    unit: "5 LTR",
    description:
      "Saffola Gold is a premium blended edible oil that contains the goodness of Rice Bran and Sunflower oil for a healthy heart journey. Equipped with Losorb technology, it ensures that your food absorbs significantly less oil, making your meals lighter and healthier for the whole family. It is rich in natural antioxidants and Oryzanol, which help in managing cholesterol levels effectively when part of a balanced diet. This 5-liter jar is a convenient and economical choice for households that prioritize both flavor and health.",
    vendor: "Marico",
    category: "Grocery",
    discount: "11%",
    rating: 4.5,
    img: "https://www.bigbasket.com/media/uploads/p/l/147491_9-saffola-gold-pro-healthy-lifestyle-edible-oil.jpg",
  },
  {
    id: 36,
    name: "Tata Salt Lite",
    price: 45,
    oldPrice: 50,
    unit: "1 KG",
    description:
      "Tata Salt Lite is a low-sodium salt designed to provide a healthy alternative for those managing high blood pressure or prioritizing cardiovascular health. It contains 15% less sodium than regular table salt while maintaining the same great salty taste that enhances the flavor of your favorite dishes. Enriched with necessary minerals, it supports overall well-being and is an easy switch for a heart-friendly lifestyle in every household. Trusted by millions, Tata Salt ensures purity and the right balance of iodine for your daily nutrition.",
    vendor: "Tata Salt",
    category: "Grocery",
    discount: "10%",
    rating: 4.6,
    img: "https://m.media-amazon.com/images/I/51UimLq2MXL._SY300_SX300_QL70_FMwebp_.jpg",
  },
  {
    id: 39,
    name: "Fortune Mustard Oil (1LTR)",
    price: 155,
    oldPrice: 180,
    unit: "1 LTR",
    description:
      "Fortune Kachi Ghani Mustard Oil is traditionally extracted from high-quality mustard seeds, offering a pungent aroma and a sharp flavor that is essential for authentic Indian cooking. Its high smoke point makes it perfect for deep-frying, sautéing, or as a pickling agent that adds a long-lasting preservative quality to your dishes. Rich in monounsaturated and polyunsaturated fats, it is considered one of the healthiest cooking oils for cold weather and traditional diets. Every drop is pure and maintains the natural nutrients of mustard.",
    vendor: "Fortune",
    category: "Grocery",
    discount: "14%",
    rating: 4.2,
    img: "https://www.bigbasket.com/media/uploads/p/l/274145_14-fortune-mustard-oil-kachi-ghani.jpg",
  },

  // --- Stationery ---
  {
    id: 11,
    name: "Pilot V5 Blue (Pack of 3)",
    price: 180,
    oldPrice: 210,
    unit: "3 PCS",
    description:
      "The Pilot V5 Hi-Tecpoint is a world-renowned liquid ink rollerball pen known for its precision needle point and ultra-smooth writing experience. Its unique ink controller system ensures a consistent flow of vibrant blue ink from the first stroke to the very last drop without any smudging. The durable metal pocket clip and comfortable grip make it a reliable choice for students, professionals, and anyone who values high-quality writing instruments. This pack of three ensures you always have a spare pen ready for your intensive writing tasks.",
    tag: "Sale",
    vendor: "Pilot",
    category: "Stationery",
    discount: "14%",
    rating: 4.2,
    img: "https://m.media-amazon.com/images/I/312PBvXYmKL._SY300_SX300_QL70_FMwebp_.jpg",
  },
  {
    id: 12,
    name: "Classmate Notebooks (6PK)",
    price: 320,
    oldPrice: 380,
    unit: "6 PCS",
    description:
      "Classmate Notebooks feature high-quality, eco-friendly paper that is smooth to write on and prevents ink from bleeding through to the other side. Each notebook is designed with a durable cover and a firm binding to withstand daily use by students in schools and colleges. The pages include a dedicated section for dates and titles, helping you stay organized with your notes and schoolwork through the academic year. This pack of six provides a complete solution for various subjects, ensuring you are well-prepared for your classes.",
    vendor: "ITC",
    category: "Stationery",
    discount: "16%",
    rating: 4.5,
    img: "https://www.bigbasket.com/media/uploads/p/l/1212080_1-classmate-notebook-a4-ruled.jpg",
  },
  {
    id: 33,
    name: "Cello Maxwriter Pen",
    price: 50,
    oldPrice: 60,
    unit: "5 PCS",
    description:
      "The Cello Maxwriter ballpoint pen is designed for those who have extensive writing needs, offering a comfortable grip and a long-lasting ink supply. Its advanced ink technology provides a smooth and skip-free writing experience that is perfect for long exams or taking detailed meeting notes. The pen features a sleek, transparent body that allows you to monitor the ink level, ensuring you never run out unexpectedly during an important task. This pack contains five pens, making it a cost-effective and dependable choice for your daily writing requirements.",
    vendor: "Cello",
    category: "Stationery",
    discount: "17%",
    rating: 4.5,
    img: "https://m.media-amazon.com/images/I/51CVtuYNLrL._SY300_SX300_QL70_FMwebp_.jpg",
  },
];

// GUIDE: MONGOOSE MODEL DEFINITION
// Since you are already using Mongoose, create 'models/Product.js' and 'models/Category.js':
/*
const ProductSchema = new mongoose.Schema({
  id_custom:   { type: Number, unique: true },
  name:        String,
  price:       Number,
  oldPrice:    Number,
  unit:        String,
  description: String,
  vendor:      String,
  category:    String,
  discount:    String,
  rating:      Number,
  image:       String, // This will store your Cloudinary URL
});

const CategorySchema = new mongoose.Schema({
  name:  { type: String, unique: true },
  count: Number,
  image: String,
  bg:    String,
});
*/

export const categoriesWithCount = [
  {
    name: "Milk & Dairy",
    count: 5,
    img: "https://www.jiomart.com/images/product/original/494271401/heritage-golden-cow-milk-1-l-pouch-product-images-o494271401-p610079697-0-202410071813.jpg?im=Resize=(420,420)",
    bg: "bg-blue-50",
  },
  {
    name: "Fruits",
    count: 5,
    img: "https://m.media-amazon.com/images/I/51fWm14UXiL._AC_UL640_FMwebp_QL65_.jpg",
    bg: "bg-orange-50",
  },
  {
    name: "Vegetables",
    count: 5,
    img: "https://www.bbassets.com/media/uploads/p/l/10000188-6_2-fresho-palak-cleaned-without-roots.jpg",
    bg: "bg-green-50",
  },
  {
    name: "Tea & Coffee",
    count: 3,
    img: "https://m.media-amazon.com/images/I/41O76L+6oDL._SY300_SX300_QL70_FMwebp_.jpg",
    bg: "bg-amber-50",
  },
  {
    name: "Snacks",
    count: 6,
    img: "https://m.media-amazon.com/images/I/41VxPV-rWsL._SY300_SX300_QL70_FMwebp_.jpg",
    bg: "bg-yellow-50",
  },
  {
    name: "Personal Care",
    count: 3,
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ0W4YGyIeHyvdg7KaIXIzHbTxcVT4nwviIH2JrzF0nDK26Ope46NqSr5c_2GsGAAvWnjp2-e5QrNNWoVVTGix1xBYUZzs991zfyghM9kwJiXCnMB-ojsimEg",
    bg: "bg-pink-50",
  },
  {
    name: "Cleaning Essentials",
    count: 5,
    img: "https://m.media-amazon.com/images/I/616ZqasKGuL.jpg",
    bg: "bg-purple-50",
  },
  {
    name: "Beverages",
    count: 4,
    img: "https://www.bigbasket.com/media/uploads/p/l/251023_11-coca-cola-soft-drink.jpg",
    bg: "bg-teal-50",
  },
  {
    name: "Electronics",
    count: 6,
    img: "https://m.media-amazon.com/images/I/313U7Xx9b4L._SY300_SX300_QL70_FMwebp_.jpg",
    bg: "bg-orange-100",
  },
  {
    name: "Stationery",
    count: 3,
    img: "https://www.bigbasket.com/media/uploads/p/l/1212080_1-classmate-notebook-a4-ruled.jpg",
    bg: "bg-red-50",
  },
];

export const promotions = {
  petFoodBanner:
    "https://m.media-amazon.com/images/I/413Z3Mfz-hL._SY300_SX300_QL70_FMwebp_.jpg",
};

// GUIDE: HOW TO ACCESS MONGODB VIA MONGOOSE
// 1. Import your DB connection utility and Models:
//    import dbConnect from "@/lib/mongodb";
//    import Product from "@/models/Product";
//
// 2. Wrap your component logic in an async function:
//    await dbConnect();
//    const allProductsFromDB = await Product.find({});
//
// 3. Replace 'allProducts' with 'allProductsFromDB' in your state.

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryQuery = searchParams.get("category");

  const [view, setView] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState(
    categoryQuery || "All",
  );

  // GUIDE: Step 1 - Create a state to hold the maximum price selected by the user.
  // We initialize it to 5000 so all products are visible by default.
  const [maxPrice, setMaxPrice] = useState(5000);

  // Sync state with URL
  React.useEffect(() => {
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    } else {
      setSelectedCategory("All");
    }
  }, [categoryQuery]);

  const filteredProducts = React.useMemo(() => {
    // GUIDE: Step 2 - We filter the products by BOTH category and price.
    // The .filter() method now checks if the price is less than or equal to our maxPrice state.
    const categoryFiltered =
      selectedCategory === "All"
        ? allProducts
        : allProducts.filter((p) => {
            if (selectedCategory === "Milk & Dairy")
              return p.category === "Dairy";
            if (selectedCategory === "Cleaning Essentials")
              return (
                p.category === "Household" ||
                p.category === "Cleaning Essentials"
              );
            if (selectedCategory === "Tea & Coffee")
              return (
                p.name.toLowerCase().includes("coffee") ||
                p.name.toLowerCase().includes("tea") ||
                p.name.toLowerCase().includes("nescafe")
              );
            if (selectedCategory === "Electronics")
              return p.category === "Electronics" || p.category === "Gadgets";
            if (selectedCategory === "Personal Care")
              return ["Personal Care", "Beauty", "Grooming"].includes(
                p.category,
              );
            return p.category === selectedCategory;
          });

    // We apply the price filter on top of the category filter
    return categoryFiltered.filter((p) => p.price <= maxPrice);
  }, [selectedCategory, maxPrice]);

  const sortedProducts = React.useMemo(
    () => [...filteredProducts].sort(() => Math.random() - 0.5),
    [filteredProducts],
  );

  const handleCategoryClick = (name) => {
    router.push(`/shop?category=${encodeURIComponent(name)}`);
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="bg-[#DEF9EC] py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black text-[#253D4E] mb-2">
            {selectedCategory === "All"
              ? "Shop All Products"
              : selectedCategory}
          </h1>
          <nav className="flex items-center text-sm font-bold text-gray-500 gap-2">
            <Link href="/" className="text-[#3BB77E] hover:underline">
              Home
            </Link>
            <FiChevronRight />
            <span className="text-gray-400">Shop</span>
            {selectedCategory !== "All" && (
              <>
                <FiChevronRight />
                <span className="text-gray-400">{selectedCategory}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 space-y-8">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-black text-[#253D4E] mb-6 border-b pb-4 border-gray-100">
              Category
            </h3>
            <ul className="space-y-4">
              <li
                onClick={() => handleCategoryClick("All")}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${selectedCategory === "All" ? "bg-[#3BB77E] text-white" : "bg-green-100 text-[#3BB77E]"}`}
                  >
                    <FiGrid size={14} />
                  </div>
                  <span
                    className={`font-bold text-sm transition-colors ${selectedCategory === "All" ? "text-[#3BB77E]" : "text-gray-600 group-hover:text-[#3BB77E]"}`}
                  >
                    All
                  </span>
                </div>
                <span className="bg-[#DEF9EC] text-[#3BB77E] text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">
                  {allProducts.length}
                </span>
              </li>
              {categoriesWithCount.map((cat, i) => (
                <li
                  key={i}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-8 h-8 object-contain"
                    />
                    <span
                      className={`font-bold text-sm transition-colors ${selectedCategory === cat.name ? "text-[#3BB77E]" : "text-gray-600 group-hover:text-[#3BB77E]"}`}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <span className="bg-[#DEF9EC] text-[#3BB77E] text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">
                    {cat.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-black text-[#253D4E] mb-6 border-b pb-4 border-gray-100">
              Fill by Price
            </h3>
            <div className="space-y-6">
              {/* GUIDE: Step 3 - Connect the slider to the maxPrice state.
                  'value' makes it a controlled component.
                  'onChange' updates the state every time you slide. */}
              <input
                type="range"
                className="w-full accent-[#3BB77E] cursor-pointer"
                min="0"
                max="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              />
              <div className="flex justify-between text-xs font-bold text-gray-400">
                <span>
                  From: <strong className="text-[#3BB77E]">₹0</strong>
                </span>
                <span>
                  {/* GUIDE: Step 4 - Display the current maxPrice dynamically in the UI. */}
                  To: <strong className="text-[#3BB77E]">₹{maxPrice}</strong>
                </span>
              </div>
              <button className="w-full bg-[#3BB77E] text-white py-3 rounded-lg font-black text-sm hover:bg-[#29A56C] transition-colors shadow-lg flex items-center justify-center gap-2">
                <FiFilter /> Filter
              </button>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-black text-[#253D4E] mb-6 border-b pb-4 border-gray-100">
              New products
            </h3>
            <div className="space-y-6">
              {allProducts.slice(0, 3).map((item, idx) => (
                <Link
                  key={idx}
                  href={`/product/${item.id}`}
                  className="flex gap-4 group cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-[#3BB77E] transition-colors shrink-0">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h5 className="font-bold text-[#253D4E] text-xs mb-1 group-hover:text-[#3BB77E] transition-colors line-clamp-2 leading-tight">
                      {item.name}
                    </h5>
                    <div className="flex items-center mb-1">
                      <span className="text-[10px] font-black text-[#3BB77E] bg-[#DEF9EC] px-2 py-0.5 rounded-md uppercase">
                        {item.unit}
                      </span>
                    </div>
                    <span className="text-[#3BB77E] font-black text-sm">
                      ₹{item.price}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <main className="w-full md:w-3/4">
          <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border rounded-2xl mb-8 shadow-sm gap-4">
            <p className="text-sm text-gray-400 font-bold">
              We found{" "}
              <span className="text-[#3BB77E]">{sortedProducts.length}</span>{" "}
              items!
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border rounded-full px-4 py-2 bg-gray-50 cursor-pointer">
                <FiGrid
                  className={
                    view === "grid" ? "text-[#3BB77E]" : "text-gray-400"
                  }
                  onClick={() => setView("grid")}
                />
                <FiList
                  className={
                    view === "list" ? "text-[#3BB77E]" : "text-gray-400"
                  }
                  onClick={() => setView("list")}
                />
              </div>
            </div>
          </div>

          <div
            className={`grid gap-6 ${view === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}
          >
            {sortedProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border hover:shadow-2xl hover:border-[#BCE3C9] transition-all rounded-2xl p-4 relative group flex flex-col h-full"
              >
                {prod.tag && (
                  <span
                    className={`absolute top-0 left-0 text-white text-[10px] font-black px-4 py-1.5 rounded-tl-2xl rounded-br-2xl z-10 ${prod.tag === "Hot" ? "bg-pink-500" : prod.tag === "Sale" ? "bg-blue-400" : "bg-orange-400"}`}
                  >
                    {prod.tag}
                  </span>
                )}
                <Link href={`/product/${prod.id}`} className="block flex-grow">
                  <div className="h-44 flex items-center justify-center p-4 mb-4 group-hover:scale-110 transition-transform cursor-pointer">
                    <img
                      src={prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="mb-2">
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-2 tracking-widest">
                      {prod.category}
                    </p>
                    <h3 className="text-sm font-black text-[#253D4E] group-hover:text-[#3BB77E] transition-colors line-clamp-2 h-10 mb-2 leading-tight">
                      {prod.name}
                    </h3>
                    <div className="flex items-center mb-1">
                      <span className="text-[11px] font-black text-[#3BB77E] bg-[#DEF9EC] px-2 py-0.5 rounded-md uppercase">
                        {prod.unit}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4 font-bold">
                      By <span className="text-[#3BB77E]">{prod.vendor}</span>
                    </p>
                  </div>
                </Link>
                <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-auto">
                  <Link href={`/product/${prod.id}`}>
                    <div>
                      <span className="text-lg font-black text-[#3BB77E]">
                        ₹{prod.price}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-300 line-through font-bold">
                          ₹{prod.oldPrice}
                        </span>
                        <span className="text-[10px] text-green-600 font-black">
                          {prod.discount} Off
                        </span>
                      </div>
                    </div>
                  </Link>
                  <button className="bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white p-2.5 rounded-lg transition-all shadow-sm">
                    <FiShoppingCart />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center font-black text-[#253D4E]">
          Loading Quickzy Shop...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
