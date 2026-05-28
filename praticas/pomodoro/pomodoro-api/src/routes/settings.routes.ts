import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const settingsRouter = Router();

// GET /settings — retorna settings, cria com defaults se não existir
settingsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    let settings = await prisma.settings.findUnique({ where: { id: 1 } });

    if (!settings) {
      settings = await prisma.settings.create({
        data: { id: 1, workTime: 25, shortBreakTime: 5, longBreakTime: 15 },
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('[GET /settings]', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// PUT /settings — atualiza settings
settingsRouter.put('/', async (req: Request, res: Response) => {
  try {
    const { workTime, shortBreakTime, longBreakTime } = req.body as {
      workTime: number;
      shortBreakTime: number;
      longBreakTime: number;
    };

    if (
      !Number.isInteger(workTime) ||
      !Number.isInteger(shortBreakTime) ||
      !Number.isInteger(longBreakTime)
    ) {
      return res.status(400).json({ message: 'Valores inválidos: workTime, shortBreakTime e longBreakTime devem ser inteiros.' });
    }

    if (workTime <= 0 || shortBreakTime <= 0 || longBreakTime <= 0) {
      return res.status(400).json({ message: 'Valores inválidos: todos os tempos devem ser maiores que zero.' });
    }

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: { workTime, shortBreakTime, longBreakTime },
      create: { id: 1, workTime, shortBreakTime, longBreakTime },
    });

    res.json(settings);
  } catch (error) {
    console.error('[PUT /settings]', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});
