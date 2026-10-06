# 📚 Room Booking Mobile App

Ứng dụng mobile đặt phòng học được xây dựng bằng **React Native + Expo + TypeScript**, sử dụng **Supabase** làm backend và database.
Project được thực hiện trong khuôn khổ môn:
> **Cross-Platform Mobile App Development – VKU**
---

## Author
**Nguyễn Thị Linh Chi**
Student ID: **23IT.B018**
Role:FullStack 
---

# Project Overview
Ứng dụng hỗ trợ sinh viên và giảng viên tìm kiếm và đặt phòng học trên thiết bị di động.
Các chức năng chính:

* 🔐 Đăng nhập / đăng ký tài khoản
* 👤 Quản lý thông tin người dùng
* 🏫 Xem danh sách phòng học
* 🔎 Tìm kiếm phòng
* 🎯 Lọc phòng theo điều kiện
* 📋 Xem thông tin chi tiết phòng
* 📅 Chọn ngày đặt phòng
* 🕐 Chọn thời gian đặt phòng
* ✅ Đặt phòng học
* 📖 Xem lịch sử đặt phòng
* ⚡ Cập nhật dữ liệu từ Supabase
* 🛡️ Xử lý trường hợp nhiều người cùng đặt một phòng
* 🎨 Animation và hiệu ứng tương tác
* 🚀 Tối ưu danh sách bằng `FlatList`

---

#  Technologies

| Technology       | Purpose                                    |
| ---------------- | ------------------------------------------ |
| React Native     | Mobile UI                                  |
| Expo             | React Native development platform          |
| TypeScript       | Type safety                                |
| Supabase         | Authentication & PostgreSQL Database       |
| TanStack Query   | Data fetching, caching and synchronization |
| React Navigation | Screen navigation                          |
| FlatList         | Efficient list rendering                   |

---

#  Project Structure
room-booking-expo/
│
├── src/
│   ├── components/
│   │   ├── RoomCard.tsx
│   │   ├── BookingPreview.tsx
│   │   └── ...
│   │
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── RoomDetailScreen.tsx
│   │   ├── BookingScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── MyBookingScreen.tsx
│   │
│   ├── services/
│   │   ├── roomService.ts
│   │   └── bookingService.ts
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   │
│   ├── types/
│   │   ├── Room.ts
│   │   └── Booking.ts
│   │
│   └── .....
│
├── assets/
│
├── App.tsx
├── package.json
├── app.json
├── tsconfig.json
├── .gitignore
└── README.md
```

---

#  Requirements
Before running the project, install:
* Node.js
* npm
* Expo CLI / Expo development environment
* Android Studio or Expo Go
* Git
Recommended environment:
Node.js >= 23
npm >= 9
```
---

#  Installation
## 1. Clone repository
```bash
git clone https://github.com/nguyenlinchi/VKURoomBooking.git
```

Move into the project directory:

```bash
cd VKURoomBooking
```
---

## 2. Install dependencies
```bash
npm install

#  3. Configure Supabase
The application uses Supabase for authentication and database operations.
Create a `.env` file in the project root:

EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace:

```text
your_supabase_project_url
```

with your Supabase project URL.

Replace:

```text
your_supabase_anon_key
```
with your Supabase publishable/anon key used by the application.

> Do not commit `.env` to GitHub.

---

#  4. Supabase Database
The project requires the following main data:
### Rooms

```text
rooms
├── id
├── name
├── photo
├── location
├── lab
├── size
└── status
```

### Bookings
```text
bookings
├── id
├── user_id
├── room_id
├── booking_date
├── start_time
├── end_time
└── created_at
```

The exact column names should match the SQL schema used in the project.
---

# ▶️ 5. Run the application
Start Expo:

```bash
npx expo start
```

After Expo starts, several options are available.

### Android Emulator
Press:

```text
a
```

in the Expo terminal.

### Physical Android Device
Install **Expo Go** on the phone and scan the QR code displayed by Expo.

Make sure the computer and phone can communicate with each other through the same network when using the standard Expo development workflow.

---

#  Main Application Flow
```text
Login
  ↓
Home
  ↓
Room List
  ↓
Search / Filter
  ↓
Room Detail
  ↓
Select Date & Time
  ↓
Booking
  ↓
Booking Confirmation
  ↓
Profile / My Booking
```

---

# 🔄 Data Flow
The application follows this architecture:

```text
React Native Screens
        ↓
TanStack Query
        ↓
Service Layer
        ↓
Supabase
        ↓
PostgreSQL Database
```

Room data:

```text
HomeScreen
    ↓
roomService.ts
    ↓
Supabase
    ↓
rooms
    ↓
FlatList
```

Booking data:

```text
BookingScreen
    ↓
bookingService.ts
    ↓
Supabase
    ↓
bookings
    ↓
MyBookingScreen
```

---

#  Race Condition Handling
The system considers the situation where two users attempt to book the same room during the same time period.

Example:

```text
User A ───────┐
              ├──→ Booking Request
User B ───────┘
```

The booking process performs validation at the database/backend level instead of relying only on the current room status displayed on the mobile application.
This prevents two users from successfully creating conflicting bookings for the same room and time slot.

---

#  Performance
The project uses `FlatList` to render the room list efficiently.
Instead of rendering all rooms simultaneously:

```tsx
rooms.map(...)
```

the application uses:

```tsx
<FlatList
  data={rooms}
  renderItem={...}
  keyExtractor={...}
/>
```

TanStack Query is also used for:
* Data fetching
* Caching
* Loading states
* Refetching
* Query invalidation
---

#  UI & Animation
The application includes interactive UI effects to improve the mobile user experience.
Animation is used for elements such as:
* Room cards
* Buttons
* Screen transitions
* User interactions
* Loading / visual feedback
The goal is to make the application feel more responsive and modern.

---

#  Testing
The application was tested on:
* Android emulator
* Physical Android device
* Different room data
* Different booking time slots
* Multiple booking scenarios

Important test cases include:
1. Login with valid account
2. Login with invalid account
3. Search for a room
4. Filter rooms
5. View room details
6. Book an available room
7. Attempt to book an unavailable room
8. Attempt to create conflicting bookings
9. Check booking history
10. Verify data synchronization with Supabase

---

#  Project Links

**GitHub Repository:**

https://github.com/nguyenlinchi/VKURoomBooking.git
```
#  Academic Information

**Course:** Cross-Platform Mobile App Development

**Institution:** VKU – Vietnam-Korea University of Information and Communication Technology

**Project:** Mini-Project 2 – Room Booking Mobile Application

**Student:** Nguyễn Thị Linh Chi

**Student ID:** 23IT.B018

**Submission Date:** 05/10/2026
