import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Trophy, Target, Zap, Shuffle, Eye, Timer, Lightbulb, Layers, Focus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Game = "memory" | "pattern" | "math" | "word" | "color" | "reaction" | "logic" | "sequence" | "focus" | null;

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
      toast({ title: "Game Over!", description: `Your score: ${score}`, variant: "destructive" });
      setActiveGame(null);
      return;
    }

    if (newUserSequence.length === gameState.sequence.length) {
      const newScore = score + 10;
      setScore(newScore);
      toast({ title: "Great job! 🎉", description: `Score: ${newScore}` });
      startMemoryGame();
    } else {
      setGameState({ ...gameState, userSequence: newUserSequence });
    }
  };

  const startWordGame = () => {
    const words = ['BRAIN', 'FOCUS', 'LEARN', 'THINK', 'SMART', 'QUICK'];
    const word = words[Math.floor(Math.random() * words.length)];
    const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
    setGameState({ word, scrambled, input: '', timeLeft: 30 });
    setActiveGame("word");
    setScore(0);

    const timer = setInterval(() => {
      setGameState((prev: any) => {
        if (!prev || prev.timeLeft <= 1) {
          clearInterval(timer);
          setActiveGame(null);
          toast({ title: "Time's up!", description: `Final score: ${score}` });
          return null;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const handleWordInput = (letter: string) => {
    if (!gameState) return;
    const newInput = gameState.input + letter;
    
    if (newInput === gameState.word) {
      const newScore = score + 15;
      setScore(newScore);
      toast({ title: "Correct! 🎯", description: `Score: ${newScore}` });
      startWordGame();
    } else if (newInput.length < gameState.word.length) {
      setGameState({ ...gameState, input: newInput });
    } else {
      toast({ title: "Wrong!", description: "Try again", variant: "destructive" });
      setGameState({ ...gameState, input: '' });
    }
  };

  const startColorGame = () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const texts = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE'];
    const colorIndex = Math.floor(Math.random() * colors.length);
    const textIndex = Math.floor(Math.random() * texts.length);
    
    setGameState({ 
      color: colors[colorIndex], 
      text: texts[textIndex], 
      correctAnswer: colorIndex === textIndex,
      timeLeft: 30
    });
    setActiveGame("color");
    setScore(0);

    const timer = setInterval(() => {
      setGameState((prev: any) => {
        if (!prev || prev.timeLeft <= 1) {
          clearInterval(timer);
          setActiveGame(null);
          toast({ title: "Time's up!", description: `Final score: ${score}` });
          return null;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const handleColorAnswer = (answer: boolean) => {
    if (!gameState) return;
    
    if (answer === gameState.correctAnswer) {
      const newScore = score + 5;
      setScore(newScore);
      toast({ title: "Correct! ✓", description: `Score: ${newScore}` });
      
      const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
      const texts = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE'];
      const colorIndex = Math.floor(Math.random() * colors.length);
      const textIndex = Math.floor(Math.random() * texts.length);
      
      setGameState({ 
        color: colors[colorIndex], 
        text: texts[textIndex], 
        correctAnswer: colorIndex === textIndex,
        timeLeft: gameState.timeLeft
      });
    } else {
      toast({ title: "Wrong!", description: "Try again", variant: "destructive" });
    }
  };

  const startReactionGame = () => {
    setGameState({ waiting: true, startTime: null, result: null });
    setActiveGame("reaction");
    setScore(0);
    
    const delay = Math.random() * 3000 + 2000;
    setTimeout(() => {
      setGameState({ waiting: false, startTime: Date.now(), result: null });
    }, delay);
  };

  const handleReactionClick = () => {
    if (!gameState) return;
    
    if (gameState.waiting) {
      toast({ title: "Too early!", description: "Wait for green!", variant: "destructive" });
      setActiveGame(null);
    } else if (gameState.startTime) {
      const reactionTime = Date.now() - gameState.startTime;
      const points = Math.max(0, 100 - Math.floor(reactionTime / 10));
      const newScore = score + points;
      setScore(newScore);
      setGameState({ ...gameState, result: reactionTime });
      toast({ title: `${reactionTime}ms! 🎯`, description: `+${points} points` });
      
      setTimeout(() => startReactionGame(), 2000);
    }
  };

  const startLogicGame = () => {
    const pattern = [1, 2, 4, 8, 16];
    const answer = 32;
    setGameState({ pattern, answer, userAnswer: '' });
    setActiveGame("logic");
    setScore(0);
  };

  const handleLogicAnswer = (ans: number) => {
    if (!gameState) return;
    
    if (ans === gameState.answer) {
      const newScore = score + 20;
      setScore(newScore);
      toast({ title: "Brilliant! 🧠", description: `Score: ${newScore}` });
      
      const patterns = [
        { pattern: [2, 4, 6, 8, 10], answer: 12 },
        { pattern: [1, 3, 9, 27, 81], answer: 243 },
        { pattern: [5, 10, 15, 20, 25], answer: 30 },
      ];
      const next = patterns[Math.floor(Math.random() * patterns.length)];
      setGameState(next);
    } else {
      toast({ title: "Not quite!", description: "Think again", variant: "destructive" });
    }
  };

  const startSequenceGame = () => {
    const sequence = Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1);
    setGameState({ sequence, userSequence: [], showSequence: true });
    setActiveGame("sequence");
    setScore(0);

    setTimeout(() => {
      setGameState((prev: any) => ({ ...prev, showSequence: false }));
    }, 3000);
  };

  const handleSequenceInput = (num: number) => {
    if (!gameState || gameState.showSequence) return;

    const newUserSequence = [...gameState.userSequence, num];
    
    if (newUserSequence.length === gameState.sequence.length) {
      if (JSON.stringify(newUserSequence) === JSON.stringify(gameState.sequence)) {
        const newScore = score + 15;
        setScore(newScore);
        toast({ title: "Perfect! 🌟", description: `Score: ${newScore}` });
        startSequenceGame();
      } else {
        toast({ title: "Game Over!", description: `Your score: ${score}`, variant: "destructive" });
        setActiveGame(null);
      }
    } else {
      setGameState({ ...gameState, userSequence: newUserSequence });
    }
  };

  const startFocusGame = () => {
    const target = Math.floor(Math.random() * 100);
    setGameState({ target, current: 50, timeLeft: 30 });
    setActiveGame("focus");
    setScore(0);

    const timer = setInterval(() => {
      setGameState((prev: any) => {
        if (!prev || prev.timeLeft <= 1) {
          clearInterval(timer);
          const accuracy = 100 - Math.abs(prev.target - prev.current);
          setScore(Math.max(0, accuracy));
          toast({ title: "Time's up!", description: `Accuracy: ${accuracy}%` });
          setActiveGame(null);
          return null;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const handleFocusAdjust = (delta: number) => {
    if (!gameState) return;
    setGameState({ ...gameState, current: Math.max(0, Math.min(100, gameState.current + delta)) });
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

    const timer = setInterval(() => {
      setGameState((prev: any) => {
        if (!prev || prev.timeLeft <= 1) {
          clearInterval(timer);
          setActiveGame(null);
          toast({ title: "Time's up!", description: `Final score: ${score}` });
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
      toast({ title: "Correct! ✨", description: `Score: ${newScore}` });

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
      toast({ title: "Wrong answer", description: "Try again!", variant: "destructive" });
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button onClick={startMemoryGame} className="h-28 flex flex-col gap-2 bg-gradient-to-br from-primary to-accent hover:scale-105 transition-transform">
            <Target className="w-6 h-6" />
            <div><p className="font-bold text-sm">Memory Master</p><p className="text-xs opacity-80">Sequence recall</p></div>
          </Button>

          <Button onClick={startPatternGame} className="h-28 flex flex-col gap-2 bg-gradient-to-br from-accent to-primary hover:scale-105 transition-transform">
            <Zap className="w-6 h-6" />
            <div><p className="font-bold text-sm">Pattern Spot</p><p className="text-xs opacity-80">Visual memory</p></div>
          </Button>

          <Button onClick={startMathGame} className="h-28 flex flex-col gap-2 bg-gradient-to-br from-primary via-accent to-primary hover:scale-105 transition-transform">
            <Trophy className="w-6 h-6" />
            <div><p className="font-bold text-sm">Math Sprint</p><p className="text-xs opacity-80">Quick math</p></div>
          </Button>

          <Button onClick={startWordGame} className="h-28 flex flex-col gap-2 bg-gradient-to-br from-secondary to-primary hover:scale-105 transition-transform">
            <Shuffle className="w-6 h-6" />
            <div><p className="font-bold text-sm">Word Unscramble</p><p className="text-xs opacity-80">Letter puzzle</p></div>
          </Button>

          <Button onClick={startColorGame} className="h-28 flex flex-col gap-2 bg-gradient-to-br from-accent to-secondary hover:scale-105 transition-transform">
            <Eye className="w-6 h-6" />
            <div><p className="font-bold text-sm">Color Match</p><p className="text-xs opacity-80">Stroop test</p></div>
          </Button>

          <Button onClick={startReactionGame} className="h-28 flex flex-col gap-2 bg-gradient-to-br from-primary to-secondary hover:scale-105 transition-transform">
            <Timer className="w-6 h-6" />
            <div><p className="font-bold text-sm">Reaction Time</p><p className="text-xs opacity-80">Speed test</p></div>
          </Button>

          <Button onClick={startLogicGame} className="h-28 flex flex-col gap-2 bg-gradient-to-br from-secondary to-accent hover:scale-105 transition-transform">
            <Lightbulb className="w-6 h-6" />
            <div><p className="font-bold text-sm">Logic Puzzle</p><p className="text-xs opacity-80">Find pattern</p></div>
          </Button>

          <Button onClick={startSequenceGame} className="h-28 flex flex-col gap-2 bg-gradient-to-br from-primary to-accent hover:scale-105 transition-transform">
            <Layers className="w-6 h-6" />
            <div><p className="font-bold text-sm">Sequence Builder</p><p className="text-xs opacity-80">Number memory</p></div>
          </Button>

          <Button onClick={startFocusGame} className="h-28 flex flex-col gap-2 bg-gradient-to-br from-accent to-primary hover:scale-105 transition-transform">
            <Focus className="w-6 h-6" />
            <div><p className="font-bold text-sm">Focus Trainer</p><p className="text-xs opacity-80">Precision aim</p></div>
          </Button>
        </div>
      </Card>
    );
  }

  // Game renders
  if (activeGame === "memory") {
    return (
      <Card className="glass-card border-primary/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold">Memory Master</h3>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">Score: {score}</span>
            <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>Exit</Button>
          </div>
        </div>
        <p className="text-center mb-6 text-muted-foreground">
          {gameState?.showSequence ? "Watch the sequence..." : "Repeat the sequence!"}
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {[0, 1, 2, 3].map((num) => (
            <button key={num} data-memory={num} onClick={() => handleMemoryClick(num)}
              className="h-24 rounded-xl glass-card hover:bg-primary/20 transition-all border-2 border-primary/30 disabled:opacity-50"
              disabled={gameState?.showSequence} />
          ))}
        </div>
      </Card>
    );
  }

  if (activeGame === "word") {
    return (
      <Card className="glass-card border-primary/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold">Word Unscramble</h3>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">Score: {score}</span>
            <span className="text-lg">Time: {gameState?.timeLeft}s</span>
            <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>Exit</Button>
          </div>
        </div>
        <div className="text-center space-y-6">
          <div className="text-3xl font-bold text-gradient">{gameState?.scrambled}</div>
          <div className="text-xl">Your answer: {gameState?.input || '_'.repeat(gameState?.word.length)}</div>
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {gameState?.scrambled.split('').map((letter: string, idx: number) => (
              <Button key={idx} onClick={() => handleWordInput(letter)}
                className="h-16 text-xl font-bold bg-gradient-primary hover:scale-105 transition-transform">
                {letter}
              </Button>
            ))}
          </div>
          <Button variant="outline" onClick={() => setGameState({ ...gameState, input: '' })}>Clear</Button>
        </div>
      </Card>
    );
  }

  if (activeGame === "color") {
    return (
      <Card className="glass-card border-primary/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold">Color Match</h3>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">Score: {score}</span>
            <span className="text-lg">Time: {gameState?.timeLeft}s</span>
            <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>Exit</Button>
          </div>
        </div>
        <div className="text-center space-y-8">
          <p className="text-muted-foreground">Does the TEXT match the COLOR?</p>
          <div className="text-6xl font-bold" style={{ color: gameState?.color }}>{gameState?.text}</div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => handleColorAnswer(true)} className="h-20 px-12 text-xl bg-gradient-to-r from-green-500 to-green-600 hover:scale-105">
              YES
            </Button>
            <Button onClick={() => handleColorAnswer(false)} className="h-20 px-12 text-xl bg-gradient-to-r from-red-500 to-red-600 hover:scale-105">
              NO
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (activeGame === "reaction") {
    return (
      <Card className="glass-card border-primary/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold">Reaction Time</h3>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">Score: {score}</span>
            <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>Exit</Button>
          </div>
        </div>
        <div className="text-center space-y-6">
          {gameState?.result ? (
            <div className="text-3xl font-bold text-gradient">{gameState.result}ms</div>
          ) : (
            <p className="text-lg">{gameState?.waiting ? "Wait for it..." : "CLICK NOW!"}</p>
          )}
          <button
            onClick={handleReactionClick}
            className={`w-full h-64 rounded-xl transition-all ${
              gameState?.waiting ? 'bg-red-500/20 border-red-500' : 'bg-green-500/20 border-green-500 animate-pulse'
            } border-4`}
          />
        </div>
      </Card>
    );
  }

  if (activeGame === "logic") {
    return (
      <Card className="glass-card border-primary/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold">Logic Puzzle</h3>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">Score: {score}</span>
            <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>Exit</Button>
          </div>
        </div>
        <div className="text-center space-y-8">
          <p className="text-lg">What comes next?</p>
          <div className="text-4xl font-bold text-gradient">
            {gameState?.pattern.join(' → ')} → ?
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {[gameState?.answer, gameState?.answer + 5, gameState?.answer - 3, gameState?.answer * 2].map((opt: number, idx: number) => (
              <Button key={idx} onClick={() => handleLogicAnswer(opt)}
                className="h-20 text-2xl font-bold bg-gradient-primary hover:scale-105 transition-transform">
                {opt}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (activeGame === "sequence") {
    return (
      <Card className="glass-card border-primary/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold">Sequence Builder</h3>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">Score: {score}</span>
            <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>Exit</Button>
          </div>
        </div>
        <div className="text-center space-y-6">
          {gameState?.showSequence ? (
            <div className="text-4xl font-bold text-gradient">{gameState.sequence.join(' ')}</div>
          ) : (
            <div className="text-2xl">Enter the sequence: {gameState?.userSequence.join(' ') || '...'}</div>
          )}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {[1,2,3,4,5,6,7,8,9].map((num) => (
              <Button key={num} onClick={() => handleSequenceInput(num)} disabled={gameState?.showSequence}
                className="h-16 text-xl font-bold bg-gradient-primary hover:scale-105 transition-transform">
                {num}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (activeGame === "focus") {
    return (
      <Card className="glass-card border-primary/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold">Focus Trainer</h3>
          <div className="flex items-center gap-4">
            <span className="text-lg">Time: {gameState?.timeLeft}s</span>
            <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>Exit</Button>
          </div>
        </div>
        <div className="text-center space-y-8">
          <div>
            <p className="text-lg mb-2">Target: <span className="text-2xl font-bold text-primary">{gameState?.target}</span></p>
            <p className="text-lg">Current: <span className="text-2xl font-bold text-accent">{gameState?.current}</span></p>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 justify-center">
              <Button onClick={() => handleFocusAdjust(10)} className="h-16 px-8 text-xl">+10</Button>
              <Button onClick={() => handleFocusAdjust(1)} className="h-16 px-8 text-xl">+1</Button>
              <Button onClick={() => handleFocusAdjust(-1)} className="h-16 px-8 text-xl">-1</Button>
              <Button onClick={() => handleFocusAdjust(-10)} className="h-16 px-8 text-xl">-10</Button>
            </div>
            <div className="w-full h-4 bg-card rounded-full overflow-hidden border border-primary/30">
              <div className="h-full bg-gradient-to-r from-accent to-primary transition-all" 
                style={{ width: `${gameState?.current}%` }} />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (activeGame === "pattern") {
    return (
      <Card className="glass-card border-primary/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold">Pattern Recognition</h3>
          <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>Exit</Button>
        </div>
        <p className="text-center mb-6">
          {gameState?.hidden ? "Memorize this pattern..." : "Recreate the pattern!"}
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {gameState?.pattern.map((active: boolean, idx: number) => (
            <div key={idx}
              className={`h-20 rounded-xl border-2 transition-all ${
                gameState.hidden && active ? "bg-primary border-primary" : "glass-card border-primary/30"
              }`} />
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
            <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>Exit</Button>
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
                <Button key={idx} onClick={() => handleMathAnswer(option)}
                  className="h-20 text-2xl font-bold bg-gradient-primary hover:scale-105 transition-transform">
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