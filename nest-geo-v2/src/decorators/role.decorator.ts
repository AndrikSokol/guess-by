import { UserRole } from '@/enum/userRole.enum';
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<UserRole[]>();
