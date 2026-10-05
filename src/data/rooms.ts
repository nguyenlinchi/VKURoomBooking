import { Room } from "../types/Room";

export const rooms: Room[] = [

  {
    id: "A3-101",
    name: "Lab A3-101",
    type: "Computer Lab",
    building: "Building A3",
    location: "Floor 1",
    capacity: 30,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    description:
      "Phòng máy tính dành cho thực hành và học nhóm.",
    facilities: [
      "Computer",
      "Projector",
      "Air Conditioner",
      "WiFi"
    ]
  },

  {
    id: "A3-102",
    name: "Lab A3-102",
    type: "Computer Lab",
    building: "Building A3",
    location: "Floor 1",
    capacity: 40,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    description:
      "Phòng lab lớn dành cho lớp học thực hành.",
    facilities: [
      "Computer",
      "Projector",
      "WiFi"
    ]
  },

  {
    id: "A3-201",
    name: "Study Room A3-201",
    type: "Study Room",
    building: "Building A3",
    location: "Floor 2",
    capacity: 6,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
    description:
      "Phòng học nhóm nhỏ.",
    facilities: [
      "Whiteboard",
      "WiFi",
      "Air Conditioner"
    ]
  },

  {
    id: "A3-202",
    name: "Study Room A3-202",
    type: "Study Room",
    building: "Building A3",
    location: "Floor 2",
    capacity: 8,
    status: "occupied",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    description:
      "Phòng học nhóm.",
    facilities: [
      "Whiteboard",
      "WiFi"
    ]
  },

  {
    id: "A3-301",
    name: "Meeting Room A3-301",
    type: "Meeting Room",
    building: "Building A3",
    location: "Floor 3",
    capacity: 12,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c",
    description:
      "Phòng họp dành cho nhóm nghiên cứu.",
    facilities: [
      "Projector",
      "Table",
      "WiFi"
    ]
  },

  {
    id: "B1-101",
    name: "Lab B1-101",
    type: "Computer Lab",
    building: "Building B1",
    location: "Floor 1",
    capacity: 35,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    description:
      "Phòng máy phục vụ lập trình.",
    facilities: [
      "Computer",
      "Projector",
      "WiFi"
    ]
  },

  {
    id: "B1-102",
    name: "Lab B1-102",
    type: "Computer Lab",
    building: "Building B1",
    location: "Floor 1",
    capacity: 40,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6",
    description:
      "Phòng lab thực hành.",
    facilities: [
      "Computer",
      "Projector",
      "WiFi"
    ]
  },

  {
    id: "B1-201",
    name: "Study Room B1-201",
    type: "Study Room",
    building: "Building B1",
    location: "Floor 2",
    capacity: 4,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    description:
      "Phòng học nhóm 4 người.",
    facilities: [
      "Whiteboard",
      "WiFi"
    ]
  },

  {
    id: "B1-202",
    name: "Study Room B1-202",
    type: "Study Room",
    building: "Building B1",
    location: "Floor 2",
    capacity: 6,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655",
    description:
      "Phòng học nhóm.",
    facilities: [
      "Whiteboard",
      "WiFi"
    ]
  },

  {
    id: "B1-301",
    name: "Meeting Room B1-301",
    type: "Meeting Room",
    building: "Building B1",
    location: "Floor 3",
    capacity: 15,
    status: "maintenance",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    description:
      "Phòng đang bảo trì.",
    facilities: [
      "Projector",
      "Table"
    ]
  },

  {
    id: "C1-101",
    name: "Lab C1-101",
    type: "Laboratory",
    building: "Building C1",
    location: "Floor 1",
    capacity: 25,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
    description:
      "Phòng thí nghiệm.",
    facilities: [
      "Equipment",
      "Projector",
      "WiFi"
    ]
  },

  {
    id: "C1-102",
    name: "Lab C1-102",
    type: "Laboratory",
    building: "Building C1",
    location: "Floor 1",
    capacity: 30,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1581093458791-9d42e3c9d8f5",
    description:
      "Phòng thí nghiệm.",
    facilities: [
      "Equipment",
      "WiFi"
    ]
  },

  {
    id: "C1-201",
    name: "Study Room C1-201",
    type: "Study Room",
    building: "Building C1",
    location: "Floor 2",
    capacity: 8,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902",
    description:
      "Phòng học nhóm.",
    facilities: [
      "Table",
      "WiFi"
    ]
  },

  {
    id: "C1-202",
    name: "Study Room C1-202",
    type: "Study Room",
    building: "Building C1",
    location: "Floor 2",
    capacity: 10,
    status: "occupied",
    image:
      "https://images.unsplash.com/photo-1503428593586-e225b39bddfe",
    description:
      "Phòng học nhóm.",
    facilities: [
      "Table",
      "WiFi"
    ]
  },

  {
    id: "D1-101",
    name: "Lab D1-101",
    type: "Computer Lab",
    building: "Building D1",
    location: "Floor 1",
    capacity: 45,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
    description:
      "Phòng máy lớn.",
    facilities: [
      "Computer",
      "Projector",
      "WiFi"
    ]
  },

  {
    id: "D1-102",
    name: "Lab D1-102",
    type: "Computer Lab",
    building: "Building D1",
    location: "Floor 1",
    capacity: 50,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    description:
      "Phòng lab 50 chỗ.",
    facilities: [
      "Computer",
      "Projector",
      "WiFi"
    ]
  },

  {
    id: "D1-201",
    name: "Study Room D1-201",
    type: "Study Room",
    building: "Building D1",
    location: "Floor 2",
    capacity: 4,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    description:
      "Phòng học nhỏ.",
    facilities: [
      "Whiteboard",
      "WiFi"
    ]
  },

  {
    id: "D1-301",
    name: "Meeting Room D1-301",
    type: "Meeting Room",
    building: "Building D1",
    location: "Floor 3",
    capacity: 20,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c",
    description:
      "Phòng họp lớn.",
    facilities: [
      "Projector",
      "Table",
      "WiFi"
    ]
  },

  {
    id: "LIB-B",
    name: "Library Zone B",
    type: "Study Room",
    building: "Main Library",
    location: "Floor 2",
    capacity: 50,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
    description:
      "Khu vực học tập trong thư viện.",
    facilities: [
      "WiFi",
      "Air Conditioner",
      "Power Outlet"
    ]
  },

  {
    id: "LIB-C",
    name: "Library Zone C",
    type: "Study Room",
    building: "Main Library",
    location: "Floor 3",
    capacity: 30,
    status: "available",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
    description:
      "Không gian học tập yên tĩnh.",
    facilities: [
      "WiFi",
      "Power Outlet"
    ]
  }
];