import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { Types } from 'mongoose';
import { disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from 'src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();
const loginDto: AuthDto = {
  login: '3037677@gmail.com',
  password: '123',
};

const testDto: CreateReviewDto = {
  name: 'Test2',
  title: 'Test Title',
  descriptions: 'Test Description',
  rating: 5,
  productId,
};
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    token = body.access_token;
  });

  it('/review/create (POST) - success', async () => {
    const response = await request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201);

    const { body } = response;
    console.log('🚀 ~ it ~ body:', body);

    createdId = body._id;
    expect(createdId).toBeDefined();
    expect(body.name).toBe(testDto.name);
    expect(body.title).toBe(testDto.title);
    expect(body.descriptions).toBe(testDto.descriptions);
    expect(body.rating).toBe(testDto.rating);
    expect(body.productId).toBe(testDto.productId);
  });

  it('/review/create (POST) - fail', async () => {
    await request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: 0 })
      .expect(400)
      .then(({ body }: request.Response) => {
        console.log(body);
      });
  });

  it('/review/byProduct/:productId (GET) - success', async () => {
    await request(app.getHttpServer())
      .get(`/review/byProduct/${productId}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);

        expect(body[0]).toMatchObject({
          name: testDto.name,
          title: testDto.title,
          descriptions: testDto.descriptions,
          rating: testDto.rating,
          productId: testDto.productId,
        });
      });
  });

  it('/review/byProduct/:productId (GET) - fail', async () => {
    await request(app.getHttpServer())
      .get(`/review/byProduct/${new Types.ObjectId().toHexString()}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
      });
  });

  it('/review/:id (DELETE) - success', async () => {
    await request(app.getHttpServer())
      .delete(`/review/${createdId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  it('/review/:id (DELETE) - fail', async () => {
    await request(app.getHttpServer())
      .delete(`/review/${new Types.ObjectId().toHexString()}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(404, { statusCode: 404, message: REVIEW_NOT_FOUND });
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });
});
