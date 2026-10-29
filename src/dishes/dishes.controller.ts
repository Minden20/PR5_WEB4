import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DishesService } from './dishes.service.js';
import { CreateDishDto } from './dto/create-dish.dto.js';
import { UpdateDishDto } from './dto/update-dish.dto.js';
import { Dish } from './entities/dish.entity.js';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('isSpicy') isSpicy?: string,
    @Query('maxPrice') maxPrice?: string,
  ): Dish[] {
    const isSpicyBool =
      isSpicy !== undefined ? isSpicy === 'true' || isSpicy === '1' : undefined;

    const maxPriceNum = maxPrice !== undefined ? Number(maxPrice) : undefined;

    return this.dishesService.findAll({
      search,
      isSpicy: isSpicyBool,
      maxPrice: maxPriceNum,
    });
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string): Dish {
    return this.dishesService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Dish {
    return this.dishesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDishDto: CreateDishDto): Dish {
    return this.dishesService.create(createDishDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto): Dish {
    return this.dishesService.update(id, updateDishDto);
  }

  @Put(':id')
  replace(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto): Dish {
    return this.dishesService.update(id, updateDishDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    this.dishesService.remove(id);
  }
}
