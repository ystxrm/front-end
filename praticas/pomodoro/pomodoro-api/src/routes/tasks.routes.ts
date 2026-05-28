import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const tasksRouter = Router();

// GET /tasks — lista todas as tasks ordenadas por startDate desc
tasksRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { startDate: 'desc' },
    });

    // BigInt não serializa para JSON nativamente — converter para string
    const serialized = tasks.map(serializeTask);
    res.json(serialized);
  } catch (error) {
    console.error('[GET /tasks]', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// POST /tasks — cria uma task
tasksRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { id, name, duration, type, startDate } = req.body as {
      id: string;
      name: string;
      duration: number;
      type: string;
      startDate: number;
    };

    if (!id || !name || !duration || !type || !startDate) {
      return res.status(400).json({ message: 'Campos obrigatórios: id, name, duration, type, startDate.' });
    }

    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'name deve ser uma string não vazia.' });
    }

    if (!Number.isInteger(duration) || duration <= 0) {
      return res.status(400).json({ message: 'duration deve ser um inteiro positivo.' });
    }

    const task = await prisma.task.create({
      data: {
        id: String(id),
        name: name.trim(),
        duration,
        type,
        startDate: BigInt(startDate),
      },
    });

    res.status(201).json(serializeTask(task));
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'Já existe uma task com esse id.' });
    }
    console.error('[POST /tasks]', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// PATCH /tasks/:id/complete — marca task como concluída
tasksRouter.patch('/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { completeDate } = req.body as { completeDate: number };

    if (!completeDate || typeof completeDate !== 'number') {
      return res.status(400).json({ message: 'completeDate é obrigatório e deve ser um número.' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: { completeDate: BigInt(completeDate) },
    });

    res.json(serializeTask(task));
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: 'Task não encontrada.' });
    }
    console.error('[PATCH /tasks/:id/complete]', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// PATCH /tasks/:id/interrupt — marca task como interrompida
tasksRouter.patch('/:id/interrupt', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { interruptDate } = req.body as { interruptDate: number };

    if (!interruptDate || typeof interruptDate !== 'number') {
      return res.status(400).json({ message: 'interruptDate é obrigatório e deve ser um número.' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: { interruptDate: BigInt(interruptDate) },
    });

    res.json(serializeTask(task));
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: 'Task não encontrada.' });
    }
    console.error('[PATCH /tasks/:id/interrupt]', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// DELETE /tasks — limpa todo o histórico
tasksRouter.delete('/', async (_req: Request, res: Response) => {
  try {
    await prisma.task.deleteMany();
    res.status(204).send();
  } catch (error) {
    console.error('[DELETE /tasks]', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Helper: BigInt não é serializável em JSON — converter para number/string
function serializeTask(task: any) {
  return {
    ...task,
    startDate: Number(task.startDate),
    completeDate: task.completeDate != null ? Number(task.completeDate) : null,
    interruptDate: task.interruptDate != null ? Number(task.interruptDate) : null,
  };
}
