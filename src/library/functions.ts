// always :: a -> b -> a
const always = curry((a, b) => a);

// compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
function compose(...fns) {
    const n = fns.length;
    return function $compose(...args) {
        let $args = args;
        for (let i = n - 1; i >= 0; i -= 1) {
            $args = [fns[i].call(null, ...$args)];
        }
        return $args[0];
    };
}

// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
function curry(fn) {
    const arity = fn.length;
    return function $curry(...args) {
        if (args.length < arity) {
            return $curry.bind(null, ...args);
        }
        return fn.call(null, ...args);
    };
}

// either :: (a -> c) -> (b -> c) -> Either a b -> c
const either = curry((f, g, e) => {
    if (e.isLeft) {
        return f(e.$value);
    }
    return g(e.$value);
});

// identity :: x -> x
const identity = x => x;

// inspect :: a -> String
function inspect(x) {
    if (x && typeof x.inspect === 'function') {
        return x.inspect();
    }
    function inspectFn(f) {
        return f.name ? f.name : f.toString();
    }
    function inspectTerm(t) {
        switch (typeof t) {
            case 'string':
                return `'${t}'`;
            case 'object': {
                const ts = Object.keys(t).map(k => [k, inspect(t[k])]);
                return `{${ts.map(kv => kv.join(': ')).join(', ')}}`;
            }
            default:
                return String(t);
        }
    }
    function inspectArgs(args) {
        return Array.isArray(args) ? `[${args.map(inspect).join(', ')}]` : inspectTerm(args);
    }
    return (typeof x === 'function') ? inspectFn(x) : inspectArgs(x);
}

// left :: a -> Either a b
const left = a => new Left(a);

// liftA2 :: (Applicative f) => (a1 -> a2 -> b) -> f a1 -> f a2 -> f b
const liftA2 = curry((fn, a1, a2) => a1.map(fn).ap(a2));

// liftA3 :: (Applicative f) => (a1 -> a2 -> a3 -> b) -> f a1 -> f a2 -> f a3 -> f b
const liftA3 = curry((fn, a1, a2, a3) => a1.map(fn).ap(a2).ap(a3));

// maybe :: b -> (a -> b) -> Maybe a -> b
const maybe = curry((v, f, m) => {
    if (m.isNothing) {
        return v;
    }
    return f(m.$value);
});

// nothing :: () -> Maybe a
const nothing = () => Maybe.of(null);

// reject :: a -> Task a b
const reject = a => Task.rejected(a);

const createCompose = curry((F, G) => class Compose {
    $value;

    inspect() {
        return `Compose(${inspect(this.$value)})`;
    }
  
    // ----- Pointed (Compose F G)
    static of(x) {
        return new Compose(F(G(x)));
    }
  
    // ----- Functor (Compose F G)
    map(fn) {
        return new Compose(this.$value.map(x => x.map(fn)));
    }
  
    // ----- Applicative (Compose F G)
    ap(f) {
        return f.map(this.$value);
    }

    constructor(x) {
        this.$value = x;
    }
});

class Either {
    $value;

    // ----- Pointed (Either a)
    static of(x) {
        if (this instanceof Left) {
            throw new Error('`of` called on class Left (value) instead of Either (type)');
        }
        if (this instanceof Right) {
            throw new Error('`of` called on class Right (value) instead of Either (type)');
        }
        return new Right(x);
    }

    constructor(x) {
        this.$value = x;
    }
}
  
class Left extends Either {
    get isLeft() {
        return true;
    }
  
    get isRight() {
        return false;
    }
  
    inspect() {
        return `Left(${inspect(this.$value)})`;
    }
  
    // ----- Functor (Either a)
    map() {
        return this;
    }
  
    // ----- Applicative (Either a)
    ap() {
        return this;
    }
  
    // ----- Monad (Either a)
    chain() {
        return this;
    }
  
    join() {
        return this;
    }
  
    // ----- Traversable (Either a)
    sequence(of) {
        return of(this);
    }
  
    traverse(of, fn) {
        return of(this);
    }
}
  
class Right extends Either {
    get isLeft() {
        return false;
    }
  
    get isRight() {
        return true;
    }
  
    inspect() {
        return `Right(${inspect(this.$value)})`;
    }
  
    // ----- Functor (Either a)
    map(fn) {
        return Either.of(fn(this.$value));
    }
  
    // ----- Applicative (Either a)
    ap(f) {
        return f.map(this.$value);
    }
  
    // ----- Monad (Either a)
    chain(fn) {
        return fn(this.$value);
    }
  
    join() {
        return this.$value;
    }
  
    // ----- Traversable (Either a)
    sequence(of) {
        return this.traverse(of, identity);
    }
  
    traverse(of, fn) {
        fn(this.$value).map(Either.of);
    }
}

class Identity {
    $value;

    inspect() {
        return `Identity(${inspect(this.$value)})`;
    }
  
    // ----- Pointed Identity
    static of(x) {
        return new Identity(x);
    }
  
    // ----- Functor Identity
    map(fn) {
        return Identity.of(fn(this.$value));
    }
  
    // ----- Applicative Identity
    ap(f) {
        return f.map(this.$value);
    }
  
    // ----- Monad Identity
    chain(fn) {
        return this.map(fn).join();
    }
  
    join() {
        return this.$value;
    }
  
    // ----- Traversable Identity
    sequence(of) {
        return this.traverse(of, identity);
    }
  
    traverse(of, fn) {
        return fn(this.$value).map(Identity.of);
    }

    constructor(x) {
        this.$value = x;
    }
}

class IO {
    unsafePerformIO;

    inspect() {
        return `IO(?)`;
    }
  
    // ----- Pointed IO
    static of(x) {
        return new IO(() => x);
    }
  
    // ----- Functor IO
    map(fn) {
        return new IO(compose(fn, this.unsafePerformIO));
    }
  
    // ----- Applicative IO
    ap(f) {
        return this.chain(fn => f.map(fn));
    }
  
    // ----- Monad IO
    chain(fn) {
        return this.map(fn).join();
    }
  
    join() {
        return this.unsafePerformIO();
    }

    constructor(fn) {
        this.unsafePerformIO = fn;
    }
}

class List {
    $value;

    inspect() {
        return `List(${inspect(this.$value)})`;
    }
  
    concat(x) {
        return new List(this.$value.concat(x));
    }
  
    // ----- Pointed List
    static of(x) {
        return new List([x]);
    }
  
    // ----- Functor List
    map(fn) {
        return new List(this.$value.map(fn));
    }
  
    // ----- Traversable List
    sequence(of) {
        return this.traverse(of, identity);
    }
  
    traverse(of, fn) {
        return this.$value.reduce(
            (f, a) => fn(a).map(b => bs => bs.concat(b)).ap(f),
            of(new List([])),
        );
    }

    constructor(xs) {
        this.$value = xs;
    }
}

class Mapping {
    $value;
  
    static of(x) {
        return new Mapping(x);
    }

    inspect() {
        return `Mapping(${inspect(this.$value)})`;
    }
  
    insert(k, v) {
        const singleton = {};
        singleton[k] = v;
        return Mapping.of(Object.assign({}, this.$value, singleton));
    }
  
    reduceWithKeys(fn, zero) {
        return Object.keys(this.$value)
            .reduce((acc, k) => fn(acc, this.$value[k], k), zero);
    }
  
    // ----- Functor (Map a)
    map(fn) {
        return this.reduceWithKeys(
            (m, v, k) => m.insert(k, fn(v)),
            new Mapping({}),
        );
    }
  
    // ----- Traversable (Map a)
    sequence(of) {
        return this.traverse(of, identity);
    }
  
    traverse(of, fn) {
        return this.reduceWithKeys(
            (f, a, k) => fn(a).map(b => m => m.insert(k, b)).ap(f),
            of(new Mapping({})),
        );
    }

    constructor(x) {
        this.$value = x;
    }
}

class Maybe {
    $value;

    get isNothing(): boolean {
        return this.$value === null || this.$value === undefined;
    }

    get isJust(): boolean {
        return !this.isNothing;
    }
  
    inspect(): string {
        return `Maybe(${inspect(this.$value)})`;
    }
  
    // ----- Pointed Maybe
    static of(x) {
        return new Maybe(x);
    }
  
    // ----- Functor Maybe
    map(fn) {
        return this.isNothing ? this : Maybe.of(fn(this.$value));
    }
  
    // ----- Applicative Maybe
    ap(f) {
        return this.isNothing ? this : f.map(this.$value);
    }
  
    // ----- Monad Maybe
    chain(fn) {
        return this.map(fn).join();
    }
  
    join() {
        return this.isNothing ? this : this.$value;
    }
  
    // ----- Traversable Maybe
    sequence(of) {
        this.traverse(of, identity);
    }
  
    traverse(of, fn) {
        return this.isNothing ? of(this) : fn(this.$value).map(Maybe.of);
    }
  
    constructor(x) {
        this.$value = x;
    }
}

class Task {
    fork;

    inspect() {
        return 'Task(?)';
    }
  
    static rejected(x) {
        return new Task((reject, _) => reject(x));
    }
  
    // ----- Pointed (Task a)
    static of(x) {
        return new Task((_, resolve) => resolve(x));
    }
  
    // ----- Functor (Task a)
    map(fn) {
        return new Task((reject, resolve) => this.fork(reject, compose(resolve, fn)));
    }
  
    // ----- Applicative (Task a)
    ap(f) {
        return this.chain(fn => f.map(fn));
    }
  
    // ----- Monad (Task a)
    chain(fn) {
        return new Task((reject, resolve) => this.fork(reject, x => fn(x).fork(reject, resolve)));
    }
  
    join() {
        return this.chain(identity);
    }

    constructor(fork) {
        this.fork = fork;
    }
}
