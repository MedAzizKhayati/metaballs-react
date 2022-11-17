export class Vec2 {
    constructor(public x = 0, public y = 0) { }
    add(v: Vec2) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    multiplyScalar(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    static distance(a: Vec2, b: Vec2) {
        return Math.sqrt(Vec2.distanceSquared(a, b));
    }
    static distanceSquared(a: Vec2, b: Vec2) {
        return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
    }
}

export class Ball {
    static DEFAULT_MIN_RADIUS = 0.01;
    static DEFAULT_MAX_RADIUS = 0.015;
    static MAX_VELOCITY = 0.25;
    private radius_ = 0;
    constructor(
        public center: Vec2,
        public radius: number,
        public velocity: Vec2,
        public bounceFactor = 0.97

    ) {
        this.radius = 0;
        this.radius_ = radius;
    }
    update(delta: number) {
        this.reboundOnWallCollision();
        this.center.x += this.velocity.x * delta;
        this.center.y += this.velocity.y * delta;

        return this;
    }
    decreaseSize(factor: number) {
        if (this.radius > 0) {
            this.radius -= factor;
        }
    }
    increaseSize(factor: number) {
        if (this.radius < this.radius_) {
            this.radius += factor;
        }
    }
    reboundOnWallCollision() {
        if (this.center.x + this.radius > 1 || this.center.x - this.radius < 0) {
            this.velocity.x *= -this.bounceFactor;
            this.center.x = Math.max(
                Math.min(this.center.x, 1 - this.radius),
                this.radius
            );
        }
        if (this.center.y + this.radius > 1 || this.center.y - this.radius < 0) {
            this.velocity.y *= -this.bounceFactor;
            this.center.y = Math.max(
                Math.min(this.center.y, 1 - this.radius),
                this.radius
            );
        }
    }
    goSmoothlyTowords(point: Vec2, force: number) {
        this.velocity.x += (point.x - this.center.x) * force;
        this.velocity.y += (point.y - this.center.y) * force;
        // limit velocity
        const velocity = Vec2.distance(new Vec2(0), this.velocity);
        if (velocity > Ball.MAX_VELOCITY) {
            const ratio = Ball.MAX_VELOCITY / velocity;
            this.velocity.x *= ratio;
            this.velocity.y *= ratio;
        }
    }
    static closestBall(balls: Ball[], point: Vec2) {
        let closestBall = balls[0];
        let closestDist = Vec2.distanceSquared(closestBall.center, point);
        for (let i = 1; i < balls.length; i++) {
            const dist = Vec2.distanceSquared(balls[i].center, point);
            if (dist < closestDist) {
                closestDist = dist;
                closestBall = balls[i];
            }
        }
        return closestBall;
    }
    static generateRandomBall(radiuxMin = Ball.DEFAULT_MIN_RADIUS, radiuxMax: number = Ball.DEFAULT_MAX_RADIUS) {
        const radius = radiuxMin + Math.random() * (radiuxMax - radiuxMin);
        const center = new Vec2(
            radius + Math.random() * (1 - 2 * radius),
            radius + Math.random() * (1 - 2 * radius)
        );
        const velocity = Ball.randomCentered(0.2);
        return new Ball(center, radius, velocity);
    }
    static generateRandomBalls(count: number, radiuxMin = Ball.DEFAULT_MIN_RADIUS, radiuxMax: number = Ball.DEFAULT_MAX_RADIUS) {
        const balls: Ball[] = [];
        for (let i = 0; i < count; i++) {
            balls.push(Ball.generateRandomBall(radiuxMin, radiuxMax));
        }
        return balls;
    }
    static randomCentered(amp = 1) {
        return new Vec2(
            amp * (Math.random() - 0.5),
            amp * (Math.random() - 0.5)
        );
    }
}