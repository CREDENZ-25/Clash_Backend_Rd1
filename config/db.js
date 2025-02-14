import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import User from '../models/User.js';
import question from '../models/questions.js';
import Progress from '../models/progress.js';

dotenv.config();

const { DB_HOST, DB_USER, DB_DB, DB_PASS } = process.env;

// Initialize Sequelize
const sequelize = new Sequelize(DB_DB, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false, // Set to false in production
});

// Initialize models
const UserModel = User(sequelize);
const ProgressModel = Progress(sequelize); 
const QuestionModel = question(sequelize);
UserModel.hasOne(ProgressModel,{
  foreignKey:'userid',
  as:'progress'
})
ProgressModel.belongsTo(UserModel, {
  foreignKey: 'userid',
  as: 'users', 
});

// Sync models with DB
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Export the sequelize instance and models
export { sequelize, UserModel, QuestionModel, ProgressModel, syncDatabase };
