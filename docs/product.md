# SettleUp - Product Specification

## 🧾 Overview

SettleUp is a mobile expense-sharing application that allows users to track, split, and settle shared expenses with friends and groups. The app focuses on simplicity, clarity, and fast interactions.

Core tagline: *Split smart. Settle easy.*

---

## 👥 User Roles

* **User** (default)

  * Can create/join groups
  * Add expenses
  * Settle debts
  * Request payments

---

## 📱 Core Modules

### 1. Authentication

* Signup (name, email, password)
* Login
* Social login (Google, Apple)
* Biometric login (optional)

---

### 2. Dashboard (Home)

#### Features:

* Total balance overview:

  * You owe
  * You are owed
* Active groups preview
* Recent activity list
* Floating Action Button (FAB) → Add Expense

#### Key UX:

* Balance is primary focus
* Color-coded:

  * Green → you are owed
  * Red → you owe

---

### 3. Groups Module

#### Group List Screen

* Tabs:

  * Active
  * Settled
  * Archived
* Each group shows:

  * Name
  * Members (avatars)
  * Last activity
  * Net balance

---

#### Create Group

* Fields:

  * Group name
  * Category (predefined):

    * Trip
    * Home
    * Office
    * Party
    * Others
* Add members (search + select)

---

#### Group Details

* Group summary:

  * Total group expense
  * Your balance
* Settlement progress (visual bar)
* Expense list
* Individual balances
* Recent activity

---

#### Group Settings

* Edit group details
* Add/remove members
* Update group currency
* Simplify debts toggle

---

### 4. Expense Module

#### Add Expense

Fields:

* Amount
* Description
* Paid by (self / other)
* Split with (multiple users)
* Split type:

  * Equal
  * Custom

#### Behavior:

* Default: split equally
* Supports group and individual expenses

---

#### Expense List

* Shows:

  * Description
  * Amount
  * Participants
  * Date
* Color-coded balances

---

### 5. Friends Module

#### Friends List

* Shows all connections
* Net balance with each friend

---

#### Friend Details

* Profile info
* Total balance:

  * Owed to you / you owe
* Transaction history

#### Actions:

* Settle Up
* Request Payment

---

### 6. Payment & Settlement

#### Settle Up Flow

* Enter amount
* Select payment method:

  * Card
  * Wallet
  * Bank transfer
* Confirm payment

---

#### Request Payment

* Triggered from friend detail page
* Fields:

  * Amount
  * Note (optional)
* Sends request to friend

---

### 7. Profile Module

#### Profile Screen

* User info
* Notification settings
* Account preferences

---

#### Notification Management

* Toggle:

  * Expense added
  * Payment reminders
  * Group activity

---

#### Currency Settings

* Default currency selection
* Search and select currency
* Supports global currencies

---

#### Account Preferences

* Payment methods
* Security settings

---

### 8. Currency System

#### Features:

* Default currency (user level)
* Group-specific currency override
* Multi-currency support

---

## 🔄 Key User Flows

### Add Expense Flow

1. Tap FAB
2. Enter amount
3. Add description
4. Select group or friend
5. Select split type
6. Save expense

---

### Settle Up Flow

1. Open friend/group
2. Tap "Settle Up"
3. Enter amount
4. Select payment method
5. Confirm

---

### Request Payment Flow

1. Open friend details
2. Tap "Request"
3. Enter amount + note
4. Send request

---

### Create Group Flow

1. Tap “New Group”
2. Enter group name
3. Select category
4. Add members
5. Create group

---

## 🧠 Core Business Logic

### Expense Splitting

* Equal split (default)
* Custom split (manual amounts)

---

### Balance Calculation

* Track:

  * Who paid
  * Who owes
* Compute net balances per user

---

### Simplify Debts

* Minimize number of transactions
* Convert multiple debts into fewer settlements

---

## ⚠️ Edge Cases

* User leaves group with pending balance
* Multi-currency conversion (future scope)
* Partial settlements
* Duplicate expense entries
* Offline sync (future enhancement)

---

## 🎨 UX Principles

* Fast expense entry (minimal steps)
* Clear financial visibility
* Low cognitive load
* Mobile-first interactions
* Use of bottom sheets for actions

---

## 📦 Future Enhancements

* Recurring expenses
* Expense analytics
* AI-based insights
* Notifications via push
* UPI / payment gateway integration

---

## 🏗️ Backend Mapping (High-Level)

Entities:

* User
* Group
* GroupMember
* Expense
* Split
* Transaction
* PaymentRequest
* Currency

---

## 🎯 Success Metrics

* Time to add expense < 5 seconds
* Daily active users
* Number of group transactions
* Payment settlement rate

---
