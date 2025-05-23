import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'bc9cd5cc7aecf072bda5a4c9c04916d8635263a1638ba3df4db8074ac5649632b6b2e4c585d82ec43f503da6fa38d1a2881d6d0a6c7f79c64b02458e5c4eeb8c',
    });
  }

  async validate(payload: any) {
    return { id: payload.id, email: payload.email };
  }
}
