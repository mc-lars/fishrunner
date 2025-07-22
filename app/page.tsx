import GameWidget from '../components/game/GameWidget';

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
          🐟 Fish Escape 🐹
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-4">
          Help the fish escape from the playful hamster!
        </p>
        <div className="text-sm text-blue-200 max-w-md mx-auto">
          Use arrow keys or WASD to move and jump. On mobile, use the virtual controls!
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-2xl p-4 w-full max-w-4xl">
        <GameWidget />
      </div>

      <div className="mt-6 text-center text-white">
        <p className="text-sm opacity-75">
          Collect stars ⭐ and avoid the hamster to score points!
        </p>
      </div>
    </main>
  );
}