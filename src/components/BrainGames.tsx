import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Trophy, Target, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Game = "memory" | "pattern" | "math" | null;

export const BrainGames = () => {
  const [activeGame, setActiveGame] = useState<Game>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<any>(null);
  const { toast } = useToast();

  const startMemoryGame = () => {
    const sequence = Array.from({ length: 5 }, () => Math.floor(Math.random() * 4));
    setGameState({ sequence, userSequence: [], step: 0, showSequence: true });
    setActiveGame("memory");
    setScore(0);

    // Show sequence
    sequence.forEach((num, idx) => {
      setTimeout(() => {
        const button = document.querySelector(`[data-memory="${num}"]`);
        button?.classList.add("animate-pulse", "bg-primary");
        setTimeout(() => {
          button?.classList.remove("animate-pulse", "bg-primary");
          if (idx === sequence.length - 1) {
            setGameState((prev: any) => ({ ...prev, showSequence: false }));
          }
        }, 500);
      }, idx * 1000);
    });
  };

  const handleMemoryClick = (num: number) => {
    if (!gameState || gameState.showSequence) return;

    const newUserSequence = [...gameState.userSequence, num];
    const isCorrect = newUserSequence.every(
      (val, idx) => val === gameState.sequence[idx]
    );

    if (!isCorrect) {
      toast({
        title: "Game Over!",
        description: `Your score: ${score}`,
        variant: "destructive",
      });
      setActiveGame(null);
      return;
    }

    if (newUserSequence.length === gameState.sequence.length) {
      const newScore = score + 10;
      setScore(newScore);
      toast({
        title: "Great job! 🎉",
        description: `Score: ${newScore}`,
      });
      startMemoryGame(); // Next round
    } else {
      setGameState({ ...gameState, userSequence: newUserSequence });
    }
  };

  const startPatternGame = () => {
    const pattern = Array.from({ length: 9 }, () => Math.random() > 0.5);
    setGameState({ pattern, hidden: true });
    setActiveGame("pattern");
    setScore(0);

    setTimeout(() => {
      setGameState((prev: any) => ({ ...prev, hidden: false }));
    }, 3000);
  };

  const startMathGame = () => {
    const generateProblem = () => {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 20) + 1;
      const ops = ["+", "-", "*"];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let answer = 0;
      let question = "";

      if (op === "+") {
        answer = a + b;
        question = `${a} + ${b}`;
      } else if (op === "-") {
        answer = a - b;
        question = `${a} - ${b}`;
      } else {
        answer = a * b;
        question = `${a} × ${b}`;
      }

      return { question, answer };
    };

    setGameState({ ...generateProblem(), timeLeft: 30 });
    setActiveGame("math");
    setScore(0);

    // Timer
    const timer = setInterval(() => {
      setGameState((prev: any) => {
        if (!prev || prev.timeLeft <= 1) {
          clearInterval(timer);
          setActiveGame(null);
          toast({
            title: "Time's up!",
            description: `Final score: ${score}`,
          });
          return null;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const handleMathAnswer = (userAnswer: number) => {
    if (!gameState) return;

    if (userAnswer === gameState.answer) {
      const newScore = score + 5;
      setScore(newScore);
      toast({
        title: "Correct! ✨",
        description: `Score: ${newScore}`,
      });

      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 20) + 1;
      const ops = ["+", "-", "*"];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let answer = 0;
      let question = "";

      if (op === "+") {
        answer = a + b;
        question = `${a} + ${b}`;
      } else if (op === "-") {
        answer = a - b;
        question = `${a} - ${b}`;
      } else {
        answer = a * b;
        question = `${a} × ${b}`;
      }

      setGameState({ question, answer, timeLeft: gameState.timeLeft });
    } else {
      toast({
        title: "Wrong answer",
        description: "Try again!",
        variant: "destructive",
      });
    }
  };

  if (!activeGame) {
    return (
      <Card className="glass-card border-primary/20 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-display font-bold text-gradient">Brain Training Games</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={startMemoryGame}
            className="h-32 flex flex-col gap-3 bg-gradient-to-br from-primary to-accent hover:scale-105 transition-transform"
          >
            <Target className="w-8 h-8" />
            <div>
              <p className="font-bold">Memory Master</p>
              <p className="text-xs opacity-80">Remember the sequence</p>
            </div>
          </Button>

          <Button
            onClick={startPatternGame}
            className="h-32 flex flex-col gap-3 bg-gradient-to-br from-accent to-primary hover:scale-105 transition-transform"
          >
            <Zap className="w-8 h-8" />
            <div>
              <p className="font-bold">Pattern Recognition</p>
              <p className="text-xs opacity-80">Spot the pattern</p>
            </div>
          </Button>

          <Button
            onClick={startMathGame}
            className="h-32 flex flex-col gap-3 bg-gradient-to-br from-primary via-accent to-primary hover:scale-105 transition-transform"
          >
            <Trophy className="w-8 h-8" />
            <div>
              <p className="font-bold">Math Sprint</p>
              <p className="text-xs opacity-80">Fast calculations</p>
            </div>
          </Button>
        </div>
      </Card>
    );
  }

  if (activeGame === "memory") {
    return (
      <Card className="glass-card border-primary/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold">Memory Master</h3>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">Score: {score}</span>
            <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>
              Exit
            </Button>
          </div>
        </div>

        <p className="text-center mb-6 text-muted-foreground">
          {gameState?.showSequence ? "Watch the sequence..." : "Repeat the sequence!"}
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {[0, 1, 2, 3].map((num) => (
            <button
              key={num}
              data-memory={num}
              onClick={() => handleMemoryClick(num)}
              className="h-24 rounded-xl glass-card hover:bg-primary/20 transition-all border-2 border-primary/30 disabled:opacity-50"
              disabled={gameState?.showSequence}
            />
          ))}
        </div>
      </Card>
    );
  }

  if (activeGame === "pattern") {
    return (
      <Card className="glass-card border-primary/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold">Pattern Recognition</h3>
          <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>
            Exit
          </Button>
        </div>

        <p className="text-center mb-6">
          {gameState?.hidden ? "Memorize this pattern..." : "Recreate the pattern!"}
        </p>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {gameState?.pattern.map((active: boolean, idx: number) => (
            <div
              key={idx}
              className={`h-20 rounded-xl border-2 transition-all ${
                gameState.hidden && active
                  ? "bg-primary border-primary"
                  : "glass-card border-primary/30"
              }`}
            />
          ))}
        </div>
      </Card>
    );
  }

  if (activeGame === "math") {
    return (
      <Card className="glass-card border-primary/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold">Math Sprint</h3>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">Score: {score}</span>
            <span className="text-lg">Time: {gameState?.timeLeft}s</span>
            <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>
              Exit
            </Button>
          </div>
        </div>

        <div className="text-center space-y-8">
          <div className="text-4xl font-bold text-gradient">{gameState?.question} = ?</div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {Array.from({ length: 4 }, (_, i) => {
              const offset = Math.floor(Math.random() * 10) - 5;
              const option = i === 0 ? gameState?.answer : gameState?.answer + offset;
              return option;
            })
              .sort(() => Math.random() - 0.5)
              .map((option, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleMathAnswer(option)}
                  className="h-20 text-2xl font-bold bg-gradient-primary hover:scale-105 transition-transform"
                >
                  {option}
                </Button>
              ))}
          </div>
        </div>
      </Card>
    );
  }

  return null;
};
