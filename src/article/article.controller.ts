import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { GetUser } from '../user/get-user.decorator';
import { UserModel } from '../user/entities/user.entity';
import { JwtAuthGuard } from 'src/user/guard/jwt-auth.guard';
import { GenerateSuggestionDto } from '../period/dto/generate-suggestion.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // Create a new article
  @Post()
  @UseGuards(JwtAuthGuard)
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @GetUser() user: UserModel,
  ): Promise<Article> {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.articleService.createArticle(createArticleDto, user);
  }

  // Get all articles for a specific user
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getArticlesByUser(@GetUser() user: UserModel): Promise<Article[]> {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.articleService.getArticlesByUser(user.id);
  }

  // Get a specific article by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getArticleById(@Param('id') id: string): Promise<Article> {
    return this.articleService.getArticleById(id);
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Post('many')
  createMany() {
    return this.articleService.createMany();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateArticle(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articleService.updateArticle(id, updateArticleDto);
  }

  // Delete an article
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteArticle(@Param('id') id: string): Promise<void> {
    return this.articleService.deleteArticle(id);
  }

  @Post('generate/suggestion')
  @UseGuards(JwtAuthGuard)
  generateSuggestion(
    @Body() generateSuggestionDto: GenerateSuggestionDto,
  ): Promise<{ text: string }> {
    return this.articleService.generateSuggestion(generateSuggestionDto);
  }
}
