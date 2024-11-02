# Birthday Buddy 🎂

⚠️ **WARNING: This project is currently under development and may not be fully functional yet.** ⚠️

## Description

**Birthday Buddy** is a feature-rich Discord bot that helps celebrate server members' birthdays and anniversaries. It provides seamless birthday management, automated reminders, and timezone-aware notifications to create a vibrant celebratory atmosphere in your Discord community.

### Key Features

- 🎉 **Birthday Registration**: Members can easily register their birthdays to receive personalized celebration messages
- ⏰ **Smart Reminders**: Automated birthday notifications sent to a designated channel at your preferred time
- 🌟 **Server Anniversary Tracking**: Celebrate members' server milestones with custom anniversary messages
- 🌍 **Global Time Zone Support**: Configure notification times and time zones to match your community's location
- 💻 **Intuitive Commands**: Simple slash commands for managing birthdays and viewing upcoming celebrations

## Getting Started

### Prerequisites

- Node.js v16.x or higher
- Discord account with bot creation privileges
- Discord server with administrator permissions
- PostgreSQL database (recommended for data persistence)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/swiizyy/BirthdayBuddy.git
   cd BirthdayBuddy
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory with:
   ```env
   DISCORD_TOKEN="your_discord_bot_token"
   DATABASE_URL="your_postgres_database_url"
   ```

4. **Launch the bot:**
   ```bash
   yarn build && yarn start
   ```

## Available Commands

### Birthday Management
- **Register Birthday**
  ```bash
  /register-birthday <day> <month> [year]
  ```
  Register your birthday for celebrations

- **View Upcoming Birthdays**
  ```bash
  /upcoming
  ```
  Display the next birthdays in the server

### Server Configuration
- **Set Notification Time**
  ```bash
  /set-notification-time <time> [timezone]
  ```
  Configure when birthday notifications are sent
  Example: `/set-notification-time 10:00 America/New_York`

- **Set Notification Channel**
  ```bash
  /set-notification-channel <channel>
  ```
  Specify where birthday messages appear
  Example: `/set-notification-channel #birthdays`

- **Remove Birthday**
  ```bash
  /remove-birthday
  ```
  Delete your birthday from the database

## Server Setup

### Administrator Configuration
1. Set the notification channel using `/set-notification-channel`
2. Configure notification timing with `/set-notification-time`
3. The bot will automatically handle birthday announcements based on these settings

### Best Practices
- Choose a dedicated channel for birthday notifications
- Set notification times that work for your community's primary timezone
- Regularly check upcoming birthdays to ensure celebrations are planned

## Contributing

We value community contributions! To help improve Birthday Buddy:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

## Support

### Issues and Bugs
Found a problem? Please open an issue on GitHub with:
- Detailed description of the issue
- Steps to reproduce
- Expected vs actual behavior

### Feature Requests
Have ideas for improvements? Submit a feature request through GitHub issues!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Tech Stack

- [Discord.js](https://discord.js.org/) - Powerful Discord API wrapper
- [Sapphire Framework](https://www.sapphirejs.dev/) - Robust Discord bot framework
- [Prisma](https://www.prisma.io/) - Modern database ORM
- [PostgreSQL](https://www.postgresql.org/) - Advanced open-source database

---

Made with ❤️ by [Swiizyy](https://github.com/swiizyy)