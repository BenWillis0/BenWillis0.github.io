from tkinter import *
import random
import time
import functools
from win32api import GetSystemMetrics

fullDeck = []  # Stores full deck
shuffledDeck = []  # Stores shuffled deck of 21

pile1 = []
pile2 = []
pile3 = []

suits = ["diamonds", "hearts", "spades", "clubs"]

xChange = 140
yChange = 240

class Card():
	def __init__(self, type, x, y):
		self.x = x
		self.y = y
		self.type = type

		self.draw()

	def draw(self):
		self.card = canvas.create_image(self.x, self.y, image=self.type)


class topCard(Card):
	def __init__(self, type, x, y):
		super().__init__(type, x, y)
		self.vel = {
			x: 0,
			y: 0
		}
		self.speed = 2

	def draw(self):
		super().draw()

	def move(self, obj, x, y):
		canvas.move(obj, x, y)
		canvas.update()

	def create3Piles(self,cards):
		for i in range(len(cards)):  # moves to position of each card through the array
			xDist, yDist = dist(canvas.coords(self.card), cards[i].x, cards[i].y)  # gets x y distance to card
			while abs(xDist) >= 3 or abs(yDist) >= 3:  # while not within 3 pixels of the card
				xDist, yDist = dist(canvas.coords(self.card), cards[i].x, cards[i].y)

				hyp = (xDist**2 + yDist**2)**0.5

				self.vel['x'] = xDist * self.speed / hyp
				self.vel['y'] = yDist * self.speed / hyp


				root.after(1,self.move(self.card, self.vel['x'], self.vel['y']))

			cards[i].draw()  # show card once moving card has gone over it
			canvas.tag_lower(cards[i].card)  # keeps moving card on top
		canvas.delete(self.card)


	def moveToCenter(self, width, height):
		xDist, yDist = dist(canvas.coords(self.card), width/2, height/2)
		while abs(xDist) >= 3 or abs(yDist) >= 3:
			xDist, yDist = dist(canvas.coords(self.card), width/2, height/2)

			hyp = (xDist**2 + yDist**2)**0.5

			self.vel['x'] = xDist * self.speed / hyp
			self.vel['y'] = yDist * self.speed / hyp

			root.after(1, self.move(self.card, self.vel['x'], self.vel['y']))
			canvas.tag_raise(self.card)

	def moveToStart(self, startX, startY):
		xDist, yDist = dist(canvas.coords(self.card), startX, startY)
		while abs(xDist) >= 3 or abs(yDist) >= 3:
			xDist, yDist = dist(canvas.coords(self.card), startX, startY)

			hyp = (xDist**2 + yDist**2)**0.5

			self.vel['x'] = xDist * self.speed / hyp
			self.vel['y'] = yDist * self.speed / hyp

			root.after(1, self.move(self.card, self.vel['x'], self.vel['y']))


def dist(cardPos, x2, y2):
	xDiff = x2 - cardPos[0]
	yDiff = y2 - cardPos[1]
	return xDiff, yDiff

def createFullDeck():
	for suit in range(len(suits)):  # loops through each suit
		for card in range(1, 10):  # loops through each card
			if card == 1:  # checks if the card is an ace
				fullDeck.append("Ace_of_" + suits[suit])
			else:
				fullDeck.append(str(card) + "_of_" + suits[suit])

def shuffleDeck(fullDeck):
	for i in range(21):  # loops to add 21 cards to shuffled deck
		randCard = fullDeck.pop(random.randint(0, len(fullDeck)-1))  # removes a random card from the full deck, stops copies
		shuffledDeck.append(randCard)  # adds the card to shuffled deck
	return shuffledDeck


def sortInto3Piles(pile):  # takes any pile of cards
	pile1,pile2,pile3 = [],[],[]
	for i in range(len(pile)):
		if (i+1) % 3 == 0:  # adds every 3rd card to pile3
			pile3.append(pile[i])
		elif (i+2) % 3 == 0:  # adds the second cards to pile2
			pile2.append(pile[i])
		else:
			pile1.append(pile[i])  # add the rest to pile1
	return [pile1, pile2, pile3]

def pileNo(num):
	global noPile
	noPile = num

def pickPile():
	t1 = Label(canvas, text="What pile is your card in?", font="Helvetica 18 bold", bg="green")
	tw = canvas.create_window(canvasWidth * 0.8, 150, window=t1)


	w1 = canvas.create_window(canvasWidth * 0.8, 250, window=b1)
	w2 = canvas.create_window(canvasWidth * 0.8, 490, window=b2)
	w3 = canvas.create_window(canvasWidth * 0.8, 730, window=b3)
	canvas.update()

	delete([tw, w1, w2, w3])
	return noPile



def delete(arr):
	for i in arr:
		canvas.delete(i)

def addPiles(pile):
	noPile = pileNo(0)
	newPile = []
	pile[0] = list(reversed(pile[0]))
	pile[1] = list(reversed(pile[1]))
	pile[2] = list(reversed(pile[2]))
	while noPile != 1 and noPile != 2 and noPile != 3:
		noPile = pickPile()



	if noPile == 1:  # makes sure pile chosen is placed into the middle of the other 2
		newPile += [pile[1]] + [pile[0]] + [pile[2]]
	elif noPile == 2:
		newPile += [pile[0]] + [pile[1]] + [pile[2]]
	elif noPile == 3:
		newPile += [pile[0]] + [pile[2]] + [pile[1]]

	return newPile, noPile

def getPiles(cards):
	pile1, pile2, pile3 = [], [], []
	for i in range(len(cards)):
		if i < 7:
			pile1.append(cards[i])
		elif i < 14:
			pile2.append(cards[i])
		else:
			pile3.append(cards[i])

	return [pile1, pile2, pile3]


def getType(i, deck):
	file = "cards/" + deck[i] + ".png"
	photo = PhotoImage(file=file)
	photo = photo.subsample(4, 4)
	return photo

def makeCards(shuffledDeck):
	listOfCards = []
	x, y = 300, 250
	for i in range(len(shuffledDeck)):
		if i % 3 == 0:  # check if the card is the first in each 3
			x = 300 + ((i/3) * xChange)  # each card is 140px to the right
			y = 250
		else:
			y += yChange
		type = getType(i, shuffledDeck)
		card = topCard(type, x, y)
		delete([card.card])  # hides card until it is shown
		listOfCards.append(card)
	return listOfCards


def moveRight(cardPiles, fullCardPiles):  # cardPiles contains just the top card, fullCardPiles has the full piles
	while canvas.coords(cardPiles[0].card)[0] <= 1190:  # go until final card
		for i in range(len(fullCardPiles[0])):  # loops through the first pile
			if cardPiles[0].card is not fullCardPiles[0][i].card:  # if it is not the same card
				if canvas.coords(cardPiles[0].card)[0] >= fullCardPiles[0][i].x and abs(
					canvas.coords(cardPiles[0].card)[1] - fullCardPiles[0][i].y) <= 1:  # if it is further right
					for j in range(3):
						delete([fullCardPiles[j][i].card])

		for j in range(3):
			canvas.move(cardPiles[j].card, 5, 0)
		canvas.update()
		time.sleep(0.01)

def repeat(deck,card):


	newDeck = sortInto3Piles(deck)
	flatCards = makeCards(deck)
	fullCardPiles = sortInto3Piles(flatCards)
	print(deck)
	print(newDeck)

	card.create3Piles(flatCards)
	newPile, noPile = addPiles(newDeck)
	print(newPile)
	flatNewPile = functools.reduce(lambda x, y: x + y, newPile)

	cardPiles = [fullCardPiles[0][0], fullCardPiles[1][0], fullCardPiles[2][0]]


	moveRight(cardPiles,fullCardPiles)

	if noPile == 1:  # makes sure pile chosen is placed into the middle of the other 2
		cardPiles[1].moveToCenter(canvasWidth, canvasHeight)  # add 1 to each index of the array to match noPile
		cardPiles[0].moveToCenter(canvasWidth, canvasHeight)
		delete([cardPiles[1].card])  # deletes card when another is on top
		cardPiles[2].moveToCenter(canvasWidth, canvasHeight)
		delete([cardPiles[0].card])
		last_card = cardPiles[2]  # the card on the top, or the highest pile, is new last_card
	elif noPile == 2:
		cardPiles[0].moveToCenter(canvasWidth, canvasHeight)
		cardPiles[1].moveToCenter(canvasWidth, canvasHeight)
		delete([cardPiles[0].card])
		cardPiles[2].moveToCenter(canvasWidth, canvasHeight)
		delete([cardPiles[1].card])
		last_card = cardPiles[2]
	else:
		cardPiles[0].moveToCenter(canvasWidth, canvasHeight)
		cardPiles[2].moveToCenter(canvasWidth, canvasHeight)
		delete([cardPiles[0].card])
		cardPiles[1].moveToCenter(canvasWidth, canvasHeight)
		delete([cardPiles[2].card])
		last_card = cardPiles[1]

	return flatNewPile,last_card


def init():
	createFullDeck()
	return shuffleDeck(fullDeck)



root = Tk()

canvasWidth = GetSystemMetrics(0)
canvasHeight = GetSystemMetrics(1)
canvas = Canvas(root, width=canvasWidth, height=canvasHeight, bg="green")
canvas.pack()




b1 = Button(canvas, padx=5, pady=5, text="Pile 1", width=25, font="bold", command=lambda: pileNo(1))
b2 = Button(canvas, padx=5, pady=5, text="Pile 2", width=25, font="bold", command=lambda: pileNo(2))
b3 = Button(canvas, padx=5, pady=5, text="Pile 3", width=25, font="bold", command=lambda: pileNo(3))


shuffledDeck = init()

cards = makeCards(shuffledDeck)  # makes an array of all the card objects

last_cardX = 200
last_cardY = 420

type = getType(len(shuffledDeck)-1, shuffledDeck)  # gets last card in deck
last_card = topCard(type, last_cardX, last_cardY)

newPile, top_card = repeat(shuffledDeck,last_card)

top_card.moveToStart(last_cardX, last_cardY)

pile, last_card = repeat(newPile, top_card)

last_card.moveToStart(last_cardX, last_cardY)

newPile, last_card = repeat(pile, last_card)

print(newPile[10])
finalCard = newPile[10]
canvas.delete("all")

l2 = Label(canvas, text="Your card is:", font="Helvetica 18 bold", bg="green")
canvas.create_window(canvasWidth / 2, (canvasHeight / 2) - 150, window=l2)

photoType = getType(0, [finalCard])
Card(photoType, canvasWidth/2, (canvasHeight/2))

root.mainloop()
