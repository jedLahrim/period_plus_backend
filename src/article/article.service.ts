import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { UserModel } from '../user/entities/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { GenerateSuggestionDto } from '../period/dto/generate-suggestion.dto';
import { Constant } from '../common/constant';
import axios from 'axios';
import { articles } from '../articles';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  // Create a new article
  async createArticle(
    createArticleDto: CreateArticleDto,
    user: UserModel,
  ): Promise<Article> {
    const article = this.articleRepository.create({
      ...createArticleDto,
      user: { id: user.id },
    });
    return this.articleRepository.save(article);
  }

  // Get all articles by user
  async getArticlesByUser(userId: string): Promise<Article[]> {
    if (!userId) {
      return this.articleRepository.find();
    }
    return this.articleRepository.find({ where: { user: { id: userId } } });
  }

  // Get a specific article by ID
  async getArticleById(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  // Update an article
  async updateArticle(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.getArticleById(id);
    Object.assign(article, updateArticleDto);
    return this.articleRepository.save(article);
  }

  // Delete an article
  async deleteArticle(id: string): Promise<void> {
    const result = await this.articleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Article not found');
    }
  }

  async generateSuggestion(generateSuggestionDto: GenerateSuggestionDto) {
    const { text, languageCode } = generateSuggestionDto;
    const generatedText = await this.getRefinedText(text, languageCode);
    return { text: generatedText };
  }

  async getRefinedText(
    originalText: string,
    languageCode: string,
  ): Promise<string> {
    try {
      const prompt = `Generate an explanation text (600 characters at least) in this language code: ${languageCode} 
      for this text: ${originalText}`;
      const options = {
        method: 'POST',
        url: Constant.OPEN_AI_URL,
        headers: Constant.OPEN_AI_HEADERS,
        data: {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
      };
      // Replace with your ChatGPT API call logic
      const response = await axios.request(options);
      const data = response.data;
      return data.choices[0].message.content;
    } catch (e) {
      console.log(e);
    }
  }

  async createMany(): Promise<Article[]> {
    const foundedArticles = articles.map((article) => {
      return this.articleRepository.create({
        title: article.title,
        description: article.description,
        articleImageUrl: article.image,
      });
    });
    return this.articleRepository.save(foundedArticles);
  }

  async findAll(): Promise<Article[]> {
    const articles = this.articleRepository
      .createQueryBuilder('article')
      .orderBy('RAND()');
    return articles.getMany();
  }
}
