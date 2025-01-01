import { NextFunction, Request, Response } from "express"
import httpResponse from "../util/httpResponse"
import httpError from "../util/httpError"
import ResponseMessage from "../constant/responseMessage"
import prisma from "../config/prismaClient"
import { randomUUID } from "crypto"

export const getFlowChart = async (req: Request, res: Response, nextFunc: NextFunction) => {
  try {
    const { id: flowId } = req.query
    if (!flowId) {
      throw new Error("FlowChart Id is not found in query")
    }

    const flowChart = await prisma.flowChart.findFirst({
      where: { flowId: String(flowId) }
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
    let { flowId } = req.query
    const flow: any = req.body?.flow
    if (!flow) {
      throw new Error("FlowChart is required")
    }

    if (!flowId) {
      flowId = randomUUID()
    }

    const response = await prisma.flowChart.create({
      data: { content: flow, flowId: String(flowId) }
    })

    httpResponse(req, res, 200, ResponseMessage.SUCCESS, response.flowId)
  } catch (error) {
    httpError(nextFunc, error, req)
  }
}
