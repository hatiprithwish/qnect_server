import { NextFunction, Request, Response } from "express"
import httpResponse from "../util/httpResponse"
import httpError from "../util/httpError"
import ResponseMessage from "../constant/responseMessage"
import prisma from "../config/prismaClient"

export const getFlowChart = async (req: Request, res: Response, nextFunc: NextFunction) => {
  try {
    const { id: flowId } = req.query
    if (!flowId) {
      throw new Error("FlowChart Id is not found in query")
    }

    const flowChart = await prisma.flowChart.findFirst({
      where: { id: Number(flowId) }
    })

    if (!flowChart) {
      throw new Error("FlowChart not found in database")
    }

    httpResponse(req, res, 200, ResponseMessage.SUCCESS, flowChart)
  } catch (error) {
    httpError(nextFunc, error, req)
  }
}

export const saveFlowChart = async (req: Request, res: Response, nextFunc: NextFunction) => {
  try {
    const flow: any = req.body?.flow
    if (!flow) {
      throw new Error("FlowChart is required")
    }

    const response = await prisma.flowChart.create({
      data: { content: flow }
    })

    httpResponse(req, res, 200, ResponseMessage.SUCCESS, response.id)
  } catch (error) {
    httpError(nextFunc, error, req)
  }
}
