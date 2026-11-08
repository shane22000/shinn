
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return await this.dataSource.query(
      'SELECT * FROM categories'
    );
  }

  async findOne(id: number) {
    const result = await this.dataSource.query(
      'SELECT * FROM categories WHERE category_id = ?',
      [id],
    );

    if (result.length === 0) {
      throw new NotFoundException('Category not found');
    }

    return result[0];
  }

  async create(data: {
    category_name: string;
    description?: string;
  }) {
    const existing = await this.dataSource.query(
      'SELECT * FROM categories WHERE category_name = ?',
      [data.category_name],
    );

    if (existing.length > 0) {
      throw new ConflictException('Category already exists');
    }

    const result = await this.dataSource.query(
      `INSERT INTO categories
       (category_name, description)
       VALUES (?, ?)`,
      [data.category_name, data.description || null],
    );

    return {
      message: 'Category created successfully',
      category_id: result.insertId,
    };
  }

  async update(
    id: number,
    data: {
      category_name?: string;
      description?: string;
    },
  ) {
    await this.findOne(id);

    if (data.category_name) {
      const existing = await this.dataSource.query(
        `SELECT * FROM categories
         WHERE category_name = ? AND category_id != ?`,
        [data.category_name, id],
      );

      if (existing.length > 0) {
        throw new ConflictException('Category name already exists');
      }
    }

    await this.dataSource.query(
      `UPDATE categories
       SET category_name = COALESCE(?, category_name),
           description = COALESCE(?, description)
       WHERE category_id = ?`,
      [
        data.category_name ?? null,
        data.description ?? null,
        id,
      ],
    );

    return {
      message: 'Category updated successfully',
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.dataSource.query(
      'DELETE FROM categories WHERE category_id = ?',
      [id],
    );

    return {
      message: 'Category deleted successfully',
    };
  }
}
