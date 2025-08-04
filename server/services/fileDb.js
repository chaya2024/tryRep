const fs = require('fs').promises;
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/db.json');

class FileDatabase {
  constructor() {
    this.data = null;
  }

  async load() {
    try {
      const content = await fs.readFile(DB_FILE, 'utf8');
      this.data = JSON.parse(content);
    } catch (error) {
      console.error('Error loading database:', error);
      this.data = {
        lessons: [],
        children: [],
        messages: [],
        aiTexts: []
      };
    }
  }

  async save() {
    try {
      await fs.writeFile(DB_FILE, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  async find(collection, query = {}) {
    await this.load();
    let items = this.data[collection] || [];
    
    // Simple query filtering
    if (Object.keys(query).length > 0) {
      items = items.filter(item => {
        return Object.keys(query).every(key => {
          if (key === '_id') {
            return item.id === query[key];
          }
          return item[key] === query[key];
        });
      });
    }
    
    return items;
  }

  async findById(collection, id) {
    await this.load();
    const items = this.data[collection] || [];
    return items.find(item => item.id === id);
  }

  async create(collection, item) {
    await this.load();
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    
    const newItem = {
      ...item,
      id: item.id || this.generateId()
    };
    
    this.data[collection].push(newItem);
    await this.save();
    return newItem;
  }

  async update(collection, id, updates) {
    await this.load();
    const items = this.data[collection] || [];
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    this.data[collection][index] = { ...this.data[collection][index], ...updates };
    await this.save();
    return this.data[collection][index];
  }

  async delete(collection, id) {
    await this.load();
    const items = this.data[collection] || [];
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }
    
    this.data[collection].splice(index, 1);
    await this.save();
    return true;
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = new FileDatabase();