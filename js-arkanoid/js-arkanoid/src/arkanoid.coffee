class Arkanoid

	constructor: () ->
		@self = this

	createPad: () ->
		@pad = @canvas.display.rectangle({
			x: @canvas.width / 2;
			y: @canvas.height - 40,
			origin: { x: "center", y: "top" },
			width: 100,	height: 10,
			fill: "#00F",
			###fill: "linear-gradient(315deg, #079, #013)",###
			join: "round",
			shadow: "0 0 10px rgba(0,0,0, 0.8)"
		})
		@canvas.addChild(@pad)
		
	createBall: () ->
		@ball = @canvas.display.ellipse({
			x: @canvas.width / 2,
			y: @pad.y - 20,
			radius: 10,
			origin: { x: "center", y: "top" },
			fill: "#F00",
			###fill: "linear-gradient(315deg, #079, #013)",###
			shadow: "0 0 5px rgba(0,0,0, 0.8)",
			stroke: "1px #000"
		})
		
		@ball.dx = 0
		@ball.dy = 0
		@ball.speed = 4
		@ball.wait = true
		
		@canvas.addChild(@ball);
	
	createBrick: (x, y) ->
		brick = @canvas.display.rectangle({
			x: x,
			y: y,
			origin: { x: "center", y: "top" },
			width: 80,	height: 20,
			fill: "#FF0",
			###fill: "linear-gradient(315deg, #FF0, #FFF)",###
			join: "round",
			shadow: "0 0 2px rgba(0,0,0, 0.8)"
		})
		@canvas.addChild(brick)
		return brick	
	
	createBricks: () ->
		i = 0;
		@bricks = []
		for x in [50..@canvas.width - 50] by 90
			for y in [20..@canvas.height / 2] by 30
				@bricks = @bricks.concat @createBrick(x, y)
		
	createObjects: () ->
		@createPad()
		@createBall()
		@createBricks()


	handleBrickCollision: (brick) ->
		if brick.removed
			return
			
		if Util.between(@ball.x, brick.x - brick.width / 2, brick.x + brick.width / 2) and Util.between(@ball.y, brick.y - brick.height / 2, brick.y + brick.height / 2)
		   @ball.dy *= -1
		   brick.removed = true
		   @canvas.removeChild(brick)
		   ###@pad.stop().animate({
		   		width: @pad.width + 40
		   }, 100)###
		   

	handleCollision: () ->
		if @ball.x > @canvas.width - @ball.radius or @ball.x < @ball.radius
			@ball.dx *= -1;
			
		if @ball.y > @canvas.height - @ball.radius or @ball.y < @ball.radius
			@ball.dy *= -1;			
			
		if @ball.y > @pad.y - @pad.height * 2 and @ball.x > @pad.x - @pad.width/2 and @ball.x < @pad.x + @pad.width
			@ball.dy = -1
			
		@handleBrickCollision(brick) for brick in @bricks
			
	loop: () ->
		arkanoid.pad.x = arkanoid.canvas.mouse.x
		
		if arkanoid.ball.wait
			arkanoid.ball.x = arkanoid.pad.x
			
			if arkanoid.canvas.mouse.buttonState == 'down'
				arkanoid.ball.wait = false
				arkanoid.ball.dx = 1
				arkanoid.ball.dy = -1
				
		else
			arkanoid.ball.x += arkanoid.ball.dx * arkanoid.ball.speed
			arkanoid.ball.y += arkanoid.ball.dy * arkanoid.ball.speed
			arkanoid.handleCollision()


	start: (canvasId) -> 
		@canvas = oCanvas.create({
			canvas: canvasId,
			fps: 60,
			drawEachFrame: true
		})
		
		@createObjects()
		@canvas.setLoop(@loop).start()
	
	
arkanoid = new Arkanoid()