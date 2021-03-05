# drawguess

drawguess is a game that combines drawing and "broken telephone".

# Usage

In order to host drawguess, you have to run both the _back_ and the _front_ servers.

### back

If running in production mode, edit the `HOST` variable in the `start:prod` script to match your host.

```
cd back
npm install
npm run start:prod
```

In development, use `npm run start`.

### front

In production, add your host to `config.ts`.

```
cd front
npm install
npm run build:prod
npm run start:prod
```

For development, use `npm run start`

You can access the game from your browser at port `5001`.

# Rules

Here's how the game works.

- _Draw:_ Player _A_ is assigned a prompt which they draw (_Elephant_)
- _Guess:_ Player _B_ tries to guess the word based on player _A_'s drawing (_Rhino_)
- _Draw:_ Player _C_ draws player _B_'s guess (_Rhino_)
- _Guess:_ Player _D_ guesses based on player _C_'s drawing (_Rhino_)

and so on...

## Scoring

If a player's guess is the same as the prompt or the previous guess, they and the artist score a point. For instance, in the above example, player _D_'s guess matches player _B_'s guess, so player _D_ and player _C_ earn one point each.

# License

drawguess is [GPLv3 licensed](./LICENSE).
