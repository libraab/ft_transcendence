"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.push(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.push(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var GameGateway = exports.GameGateway = function () {
    var _classDecorators = [(0, websockets_1.WebSocketGateway)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _server_decorators;
    var _server_initializers = [];
    var _handleJoin_decorators;
    var _handleMoveLeftPad_decorators;
    var _handleMoveRightPad_decorators;
    var _handleReady_decorators;
    var _handleBallPosition_decorators;
    var _handleScoreUpdate_decorators;
    var _handleGameFinished_decorators;
    var GameGateway = _classThis = /** @class */ (function () {
        function GameGateway_1() {
            this.server = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _server_initializers, void 0));
            this.leftScore = 0;
            this.rightScore = 0;
            this.readyPlayers = 0;
        }
        GameGateway_1.prototype.afterInit = function (server) {
            console.log('WebSocket server initialized');
        };
        GameGateway_1.prototype.handleConnection = function (client) {
            console.log("Client connected: ".concat(client.id));
        };
        GameGateway_1.prototype.handleDisconnect = function (client) {
            console.log("Client disconnected: ".concat(client.id));
            if (client === this.leftPlayer || client === this.rightPlayer) {
                this.server.emit('emptyRoom');
                this.leftPlayer = null;
                this.rightPlayer = null;
                this.readyPlayers = 0;
                this.leftScore = 0;
                this.rightScore = 0;
            }
        };
        GameGateway_1.prototype.handleJoin = function (client, options) {
            if (!this.leftPlayer) {
                this.leftPlayer = client;
                this.leftPlayerUsername = options.player_name;
                client.emit('player', 'left');
                this.leftPlayerSkin = options.padSkin;
            }
            else if (!this.rightPlayer) {
                this.rightPlayer = client;
                this.rightPlayerUsername = options.player_name;
                client.emit('player', 'right');
                this.server.emit('playerSkin', { left: this.leftPlayerSkin, right: this.rightPlayerSkin });
                this.server.emit('playersFound', {
                    player_left_id: this.leftPlayer.id,
                    player_right_id: this.rightPlayer.id,
                });
                this.server.emit('paddle_left', { x: 0, y: 0 });
                this.server.emit('paddle_right', { x: 0, y: 0 });
                this.server.emit('launch', { x: 0, y: 0 });
                this.server.emit('set_ball_position', { x: 0, y: 0 });
            }
            else {
                client.emit('player', 'spectator');
            }
        };
        GameGateway_1.prototype.handleMoveLeftPad = function (client, message) {
            if (client === this.leftPlayer || client === this.rightPlayer || client.id === 'spectator') {
                this.server.emit('paddle_left', { x: message.x, y: message.y });
            }
        };
        GameGateway_1.prototype.handleMoveRightPad = function (client, message) {
            if (client === this.leftPlayer || client === this.rightPlayer || client.id === 'spectator') {
                this.server.emit('paddle_right', { x: message.x, y: message.y });
            }
        };
        GameGateway_1.prototype.handleReady = function (client) {
            this.readyPlayers++;
            if (this.readyPlayers === 2) {
                this.server.emit('launch', { x: 500, y: 500 });
            }
        };
        GameGateway_1.prototype.handleBallPosition = function (client, message) {
            if (client === this.leftPlayer || client === this.rightPlayer || client.id === 'spectator') {
                this.server.emit('set_ball_position', { x: message.x, y: message.y });
            }
        };
        GameGateway_1.prototype.handleScoreUpdate = function (client, message) {
            this.leftScore = message.score_left;
            this.rightScore = message.score_right;
            this.server.emit('updated_score', { score_left: this.leftScore, score_right: this.rightScore });
        };
        GameGateway_1.prototype.handleGameFinished = function (client, message) {
            this.server.emit('end', {
                player_left: this.leftPlayer.id,
                player_right: this.rightPlayer.id,
                score: { right: this.rightScore, left: this.leftScore },
                winner: message.winner,
                left_username: this.leftPlayerUsername,
                right_username: this.rightPlayerUsername,
            });
            this.leftPlayer = null;
            this.rightPlayer = null;
            this.readyPlayers = 0;
            this.leftScore = 0;
            this.rightScore = 0;
        };
        return GameGateway_1;
    }());
    __setFunctionName(_classThis, "GameGateway");
    (function () {
        _server_decorators = [(0, websockets_1.WebSocketServer)()];
        _handleJoin_decorators = [(0, websockets_1.SubscribeMessage)('join')];
        _handleMoveLeftPad_decorators = [(0, websockets_1.SubscribeMessage)('move_left_pad')];
        _handleMoveRightPad_decorators = [(0, websockets_1.SubscribeMessage)('move_right_pad')];
        _handleReady_decorators = [(0, websockets_1.SubscribeMessage)('ready')];
        _handleBallPosition_decorators = [(0, websockets_1.SubscribeMessage)('ball_position')];
        _handleScoreUpdate_decorators = [(0, websockets_1.SubscribeMessage)('score_update')];
        _handleGameFinished_decorators = [(0, websockets_1.SubscribeMessage)('game_finished')];
        __esDecorate(_classThis, null, _handleJoin_decorators, { kind: "method", name: "handleJoin", static: false, private: false, access: { has: function (obj) { return "handleJoin" in obj; }, get: function (obj) { return obj.handleJoin; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleMoveLeftPad_decorators, { kind: "method", name: "handleMoveLeftPad", static: false, private: false, access: { has: function (obj) { return "handleMoveLeftPad" in obj; }, get: function (obj) { return obj.handleMoveLeftPad; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleMoveRightPad_decorators, { kind: "method", name: "handleMoveRightPad", static: false, private: false, access: { has: function (obj) { return "handleMoveRightPad" in obj; }, get: function (obj) { return obj.handleMoveRightPad; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleReady_decorators, { kind: "method", name: "handleReady", static: false, private: false, access: { has: function (obj) { return "handleReady" in obj; }, get: function (obj) { return obj.handleReady; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleBallPosition_decorators, { kind: "method", name: "handleBallPosition", static: false, private: false, access: { has: function (obj) { return "handleBallPosition" in obj; }, get: function (obj) { return obj.handleBallPosition; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleScoreUpdate_decorators, { kind: "method", name: "handleScoreUpdate", static: false, private: false, access: { has: function (obj) { return "handleScoreUpdate" in obj; }, get: function (obj) { return obj.handleScoreUpdate; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleGameFinished_decorators, { kind: "method", name: "handleGameFinished", static: false, private: false, access: { has: function (obj) { return "handleGameFinished" in obj; }, get: function (obj) { return obj.handleGameFinished; } } }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _server_decorators, { kind: "field", name: "server", static: false, private: false, access: { has: function (obj) { return "server" in obj; }, get: function (obj) { return obj.server; }, set: function (obj, value) { obj.server = value; } } }, _server_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        GameGateway = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GameGateway = _classThis;
}();
