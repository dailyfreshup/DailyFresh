import {
  TruckIcon,
  LeafIcon,
  ClockIcon,
  ShieldCheckIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
} from "lucide-react";
import { SiFacebook, SiX, SiInstagram } from "@icons-pack/react-simple-icons";
import hero_bg from "./HeroImg.png";
import hero_bg2 from "./HeroImg2.png";
import delivery_truck from "./delivery_truck.svg";
import logo_text from "./Logo_text.png";
import logo from "./Logo.png";
import fresh_vegetables from "./fresh_vegetables.webp";
import fresh_fruits from "./fresh_fruits.webp";
import dairy_products from "./dairy_products.jpg";
import grains_rice from "./grains_rice.jpg";
import flour_bakery from "./flour_bakery.jpg";
import spices_seasonings from "./spices_seasonings.webp";
import beverages from "./beverages.webp";
import cooking_oil from "./cooking_oil.jpg";
import packaging_supplies from "./packaging_supplies.webp";

export const assets = {
  delivery_truck,
  hero_bg,
  logo_text,
  logo,
};

export const categoriesData = [
  {
    slug: "fresh-vegetables",
    name: "Fresh Vegetables",
    image: fresh_vegetables,
  },
  {
    slug: "fresh-fruits",
    name: "Fresh Fruits",
    image: fresh_fruits,
  },
  {
    slug: "dairy-products",
    name: "Dairy Products",
    image: dairy_products,
  },
  {
    slug: "grains-rice",
    name: "Grains & Rice",
    image: grains_rice,
  },
  {
    slug: "flour-bakery",
    name: "Flour & Bakery",
    image: flour_bakery,
  },
  {
    slug: "spices-seasonings",
    name: "Spices & Seasonings",
    image: spices_seasonings,
  },
  {
    slug: "beverages",
    name: "Beverages",
    image: beverages,
  },
  {
    slug: "cooking-oil",
    name: "Cooking Oil",
    image: cooking_oil,
  },
  {
    slug: "packaging-supplies",
    name: "Packaging Supplies",
    image: packaging_supplies,
  },
];

export const heroSectionData = {
  description:
    "Supplying restaurants, hotels, cafés, and retail businesses with high-quality raw materials at reliable wholesale price.",
  hero_image: hero_bg2,
  hero_features: [
    { icon: TruckIcon, title: "Free Delivery", desc: "Orders over $20" },
    { icon: LeafIcon, title: "100% Organic", desc: "Certified products" },
    { icon: ClockIcon, title: "Same Day", desc: "Express delivery" },
    { icon: ShieldCheckIcon, title: "Secure Pay", desc: "Safe checkout" },
  ],
};

export const deliveryPartnerLoginImage =
  "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200";

export const footerData = {
  brand: {
    name: "DailyFresh",
    description:
      "Supplying restaurants, hotels, cafés, and retail businesses with high-quality raw materials at reliable wholesale price",
    socials: [
      { icon: SiFacebook, link: "#" },
      { icon: SiX, link: "#" },
      { icon: SiInstagram, link: "#" },
    ],
  },

  sections: [
    {
      title: "Quick Links",
      links: [
        { label: "All Products", to: "/products" },
        { label: "About", to: "/about" },
        { label: "Track Order", to: "/orders" },
        { label: "Contact", to: "/contact" },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { label: "My Account", to: "/profile" },
        { label: "Order History", to: "/orders" },
        { label: "Addresses", to: "/addresses" },
        { label: "Checkout", to: "/checkout" },
      ],
    },
  ],

  contact: [
    { icon: MapPinIcon, text: "123 Green Valley Rd, Portland" },
    { icon: PhoneIcon, text: "+91 93366 51494" },
    { icon: MailIcon, text: "akashrai@gmail.com" },
  ],

  bottom: {
    copyright: "© 2026 DailyFresh. All rights reserved.",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
};

export const statusColors: Record<string, string> = {
  Placed: "bg-blue-100 text-blue-700",
  Confirmed: "bg-indigo-100 text-indigo-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export const iconsForLeafpad = {
  truck: "https://cdn-icons-png.flaticon.com/512/3097/3097180.png",
  destination: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
};

export const dummyProducts = [];

export const dummyAdminDashboardData = {
  totalOrders: 1,
  totalUsers: 3,
  totalProducts: 27,
  outOfStock: 0,
  recentOrders: [
    {
      shippingAddress: {
        label: "Home",
        address: "New Market Road ",
        city: "New York ",
        state: "NY",
        zip: "876543",
        lat: 40.7128,
        lng: -74.006,
      },
      liveLocation: {
        lat: 40.7128,
        lng: -74.006,
        updatedAt: "2026-04-06T08:41:27.211Z",
      },
      id: "69d366617ed7e54198d67dac",
      user: {
        id: "69bb6caf448f2d818db59122",
        name: "Admin",
        email: "admin@example.com",
        phone: "9336651494",
      },
      items: [
        {
          product: "69c22613ae75a98c7cd13b3b",
          name: "Butter Croissant 100g",
          image:
            "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/zvoeqbvrbrt7atqj0dbu.png",
          price: 45,
          quantity: 2,
          unit: "100g",
          id: "69d366617ed7e54198d67dad",
        },
        {
          product: "69c22613ae75a98c7cd13b36",
          name: "Barley 1kg",
          image:
            "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/spb5sgy8g24rned9nwog.png",
          price: 140,
          quantity: 1,
          unit: "1kg",
          id: "69d366617ed7e54198d67dae",
        },
      ],
      paymentMethod: "cash",
      subtotal: 230,
      deliveryFee: 0,
      tax: 18.4,
      total: 248.4,
      status: "Delivered",
      statusHistory: [
        {
          status: "Placed",
          note: "Order placed successfully",
          id: "69d366617ed7e54198d67daf",
          timestamp: "2026-04-06T07:53:05.769Z",
        },
        {
          status: "Assigned",
          note: "Assigned to Rahul",
          id: "69d366ab7ed7e54198d67dbe",
          timestamp: "2026-04-06T07:54:19.796Z",
        },
        {
          status: "Packed",
          note: "Status updated to Packed",
          id: "69d366b37ed7e54198d67ddc",
          timestamp: "2026-04-06T07:54:27.171Z",
        },
        {
          status: "Out for Delivery",
          note: "Status updated to Out for Delivery",
          id: "69d366b57ed7e54198d67e00",
          timestamp: "2026-04-06T07:54:29.226Z",
        },
        {
          status: "Delivered",
          note: "Delivered by partner",
          id: "69d373207ed7e54198d681b1",
          timestamp: "2026-04-06T08:47:28.983Z",
        },
      ],
      deliveryPartner: {
        id: "69bbfc3866db7c6cdea47ede",
        name: "Rahul",
        phone: "987654321",
      },
      deliveryOtp: "",
      isPaid: false,
      createdAt: "2026-04-06T07:53:05.774Z",
      updatedAt: "2026-04-06T08:47:28.984Z",
      __v: 4,
    },
    {
      shippingAddress: {
        label: "Home",
        address: "New Market Road ",
        city: "New York ",
        state: "NY",
        zip: "876543",
        lat: 40.7128,
        lng: -74.006,
      },
      liveLocation: {
        lat: 40.7128,
        lng: -74.006,
        updatedAt: "2026-04-06T08:41:27.211Z",
      },
      id: "69d366617ed7e54198d67dac",
      user: {
        id: "69bb6caf448f2d818db59122",
        name: "Admin",
        email: "admin@example.com",
        phone: "9336651494",
      },
      items: [
        {
          product: "69c22613ae75a98c7cd13b3b",
          name: "Butter Croissant 100g",
          image:
            "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/zvoeqbvrbrt7atqj0dbu.png",
          price: 45,
          quantity: 2,
          unit: "100g",
          id: "69d366617ed7e54198d67dad",
        },
        {
          product: "69c22613ae75a98c7cd13b36",
          name: "Barley 1kg",
          image:
            "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/spb5sgy8g24rned9nwog.png",
          price: 140,
          quantity: 1,
          unit: "1kg",
          id: "69d366617ed7e54198d67dae",
        },
      ],
      paymentMethod: "cash",
      subtotal: 230,
      deliveryFee: 0,
      tax: 18.4,
      total: 248.4,
      status: "Delivered",
      statusHistory: [
        {
          status: "Placed",
          note: "Order placed successfully",
          id: "69d366617ed7e54198d67daf",
          timestamp: "2026-04-06T07:53:05.769Z",
        },
        {
          status: "Assigned",
          note: "Assigned to Rahul",
          id: "69d366ab7ed7e54198d67dbe",
          timestamp: "2026-04-06T07:54:19.796Z",
        },
        {
          status: "Packed",
          note: "Status updated to Packed",
          id: "69d366b37ed7e54198d67ddc",
          timestamp: "2026-04-06T07:54:27.171Z",
        },
        {
          status: "Out for Delivery",
          note: "Status updated to Out for Delivery",
          id: "69d366b57ed7e54198d67e00",
          timestamp: "2026-04-06T07:54:29.226Z",
        },
        {
          status: "Delivered",
          note: "Delivered by partner",
          id: "69d373207ed7e54198d681b1",
          timestamp: "2026-04-06T08:47:28.983Z",
        },
      ],
      deliveryPartner: {
        id: "69bbfc3866db7c6cdea47ede",
        name: "Rahul",
        phone: "987654321",
      },
      deliveryOtp: "",
      isPaid: false,
      createdAt: "2026-04-06T07:53:05.774Z",
      updatedAt: "2026-04-06T08:47:28.984Z",
      __v: 4,
    },
  ],
};

export const dummyDashboardOrdersData = [
  {
    shippingAddress: {
      label: "Home",
      address: "New Market Road ",
      city: "New York ",
      state: "NY",
      zip: "876543",
      lat: 40.7128,
      lng: -74.006,
    },
    liveLocation: {
      lat: 40.7128,
      lng: -74.006,
      updatedAt: "2026-04-06T08:41:27.211Z",
    },
    id: "69d366617ed7e54198d67dac",
    user: {
      id: "69bb6caf448f2d818db59122",
      name: "Admin",
      email: "admin@example.com",
    },
    items: [
      {
        product: "69c22613ae75a98c7cd13b3b",
        name: "Butter Croissant 100g",
        image:
          "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/zvoeqbvrbrt7atqj0dbu.png",
        price: 45,
        quantity: 2,
        unit: "100g",
        id: "69d366617ed7e54198d67dad",
      },
      {
        product: "69c22613ae75a98c7cd13b36",
        name: "Barley 1kg",
        image:
          "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/spb5sgy8g24rned9nwog.png",
        price: 140,
        quantity: 1,
        unit: "1kg",
        id: "69d366617ed7e54198d67dae",
      },
    ],
    paymentMethod: "cash",
    subtotal: 230,
    deliveryFee: 0,
    tax: 18.4,
    platformFee: 4,
    total: 234,
    status: "Delivered",
    statusHistory: [
      {
        status: "Placed",
        note: "Order placed successfully",
        id: "69d366617ed7e54198d67daf",
        timestamp: "2026-04-06T07:53:05.769Z",
      },
      {
        status: "Confirmed",
        note: "Order confirmed",
        id: "69d366b37ed7e54198d67ddc",
        timestamp: "2026-04-06T07:54:27.171Z",
      },
      {
        status: "Delivered",
        note: "Delivered by partner",
        id: "69d373207ed7e54198d681b1",
        timestamp: "2026-04-06T08:47:28.983Z",
      },
    ],
    isPaid: false,
    createdAt: "2026-04-06T07:53:05.774Z",
    updatedAt: "2026-04-06T08:47:28.984Z",
    __v: 4,
  },
  {
    shippingAddress: {
      label: "Home",
      address: "New Market Road ",
      city: "New York ",
      state: "NY",
      zip: "876543",
      lat: 40.7128,
      lng: -74.006,
    },
    liveLocation: {
      lat: 40.7128,
      lng: -74.006,
      updatedAt: "2026-04-06T08:41:27.211Z",
    },
    id: "69d366617ed7e54198d67dad",
    user: {
      id: "69bb6caf448f2d818db59122",
      name: "Admin",
      email: "admin@example.com",
    },
    items: [
      {
        product: "69c22613ae75a98c7cd13b3b",
        name: "Butter Croissant 100g",
        image:
          "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/zvoeqbvrbrt7atqj0dbu.png",
        price: 45,
        quantity: 2,
        unit: "100g",
        id: "69d366617ed7e54198d67dad",
      },
      {
        product: "69c22613ae75a98c7cd13b36",
        name: "Barley 1kg",
        image:
          "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/spb5sgy8g24rned9nwog.png",
        price: 140,
        quantity: 1,
        unit: "1kg",
        id: "69d366617ed7e54198d67dae",
      },
    ],
    paymentMethod: "cash",
    subtotal: 230,
    deliveryFee: 0,
    tax: 18.4,
    platformFee: 4,
    total: 234,
    status: "Confirmed",
    statusHistory: [
      {
        status: "Placed",
        note: "Order placed successfully",
        id: "69d366617ed7e54198d67daf",
        timestamp: "2026-04-06T07:53:05.769Z",
      },
      {
        status: "Confirmed",
        note: "Order confirmed",
        id: "69d366b37ed7e54198d67ddc",
        timestamp: "2026-04-06T07:54:27.171Z",
      },
    ],
    isPaid: false,
    createdAt: "2026-04-06T07:53:05.774Z",
    updatedAt: "2026-04-06T08:47:28.984Z",
    __v: 4,
  },
];

export const dummyCartData = [
  { product: dummyProducts[0], quantity: 1 },
  { product: dummyProducts[1], quantity: 1 },
  { product: dummyProducts[2], quantity: 1 },
];

export const dummyAddressData = [
  {
    label: "Home",
    address: "123 Main St ",
    city: "New York ",
    state: "NY",
    zip: "10001",
    isDefault: true,
    lat: 40.7128,
    lng: -74.006,
    id: "69d3652df9a340288f1a0f8c",
  },
  {
    label: "Work",
    address: "456 Market St ",
    city: "New York ",
    state: "NY",
    zip: "10002",
    isDefault: false,
    lat: 40.7128,
    lng: -74.006,
    id: "69d3652df9a340288f1a0f8d",
  },
];
