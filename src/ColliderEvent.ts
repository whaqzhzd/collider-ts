class ColliderEvent {
    private a: HitBox;
    private b: HitBox;
    private collided: boolean;

    public init(a: HitBox, b: HitBox, collided: boolean) {
        if (a == null || b == null) throw new Error();
        this.a = a;
        this.b = b;
        this.collided = collided;
    }

    public clear() {
        this.a = null;
        this.b = null;
    }

    public isInitialized() {return this.a != null;}
	public involves( hitBox:HitBox) {return this.a == hitBox || this.b == hitBox;}
    public getTime() {return this.a.getTime();}
    public isCollision():boolean {return this.collided;}
    public isSeparation():boolean {return !this.collided;}
    public getFirst():HitBox {return this.a;}
    public getSecond():HitBox {return this.b;}
    public  getOther(hitBox:HitBox ):HitBox {
		if(this.a == hitBox) return this.b;
		else if(this.b == hitBox) return this.a;
		else throw new Error();
	}
}