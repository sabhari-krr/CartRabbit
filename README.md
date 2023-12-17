# Guest Room Booking Application

## Getting Started

### Prerequisites

1. **Install XAMPP:**
   Download and install XAMPP from [here](https://www.apachefriends.org/index.html).

2. **Configure XAMPP:**
   - Start the Apache and MySQL services.
   - Open phpMyAdmin and create a new database named `guest_booking`.

3. **Install Composer:**
   Download and install Composer from [here](https://getcomposer.org/).

### Setting Up PHP Mailer

1. Open a terminal and navigate to the project directory.

2. phpmailer is already in the project folder, if not Run the following command to install PHP Mailer:
   ```php
   composer require phpmailer/phpmailer
   ```
### Configure PHP Mailer:
  - Open php/mailer.php and update the following email server details:
```php
// SMTP Configuration
$mail->isSMTP();
$mail->Host = 'your_smtp_host';
$mail->SMTPAuth = true;
$mail->Username = 'your_smtp_username';
$mail->Password = 'your_smtp_password';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;
```

## Running the Application
1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/guest-room-booking.git
```
2. **Move the project folder:**
- Move the project folder to the htdocs directory in your XAMPP installation.

3. **Update Database Configuration:**
- Open config.php and update the database connection details.

4. **Create database**
- Use the name mentioned in the cofig as db name and then find the db schema inside the db folder.
- Import it into the database. ***IT HAS SAMPLE DATA, ALSO, IMAGES ARE AVAILABLE IN THE FOLDER assets/room_images***

6. **Access the Application:**
- Open a web browser and navigate to http://localhost/cartrabbit.

## Work Flow
### Owner Module
1. **Registration and Sign In**
- Owners can register and sign in to manage their properties.

2. **Forgot Password**
- Owners can reset their password by providing their email. PHP Mailer is used to send password reset emails.

3. **Property Management**
- Owners can register properties, view property details, and edit property information. Google Map links are collected for property locations.

4. **Room Management**
- Owners can add rooms, set maximum stay limits, view rooms, and delete them. Photos can be uploaded and viewed for each room.

### Customer Module
1. **Registration and Sign In**
- Customers can register and sign in to book rooms.

2. **Room Booking**
- Customers can select check-in and check-out dates along with the city to view available rooms. They can then select and book a room.

3. **Booking Validation**
- Customers are warned if their selected date range exceeds the maximum stay limit for the room.

4. **Booking Confirmation**
- Upon successful booking, customers receive an email with room details, booking dates, and property location for easy navigation.
  
### Geodata REST API
- The application uses a Geodata REST API to dynamically populate country, state, and city options in the registration and booking forms.
