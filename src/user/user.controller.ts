import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.findById(req.user.id);
  }

  @Post(':userId/favorite-movies/:movieId')
  async addFavoriteMovie(
    @Param('userId') userId: number,
    @Param('movieId') movieId: number,
  ) {
    return this.userService.addMovieToFavorites(userId, movieId);
  }

  @Delete(':userId/favorite-movies/:movieId')
  async removeFavoriteMovie(
    @Param('userId') userId: number,
    @Param('movieId') movieId: number,
  ) {
    return this.userService.removeMovieFromFavorites(userId, movieId);
  }
}
