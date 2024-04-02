from typing import Annotated, Any

import aiohttp
from fastapi import FastAPI, Path, Query
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from pydantic import TypeAdapter
from pydantic_settings import BaseSettings


class Config(BaseSettings):
    opa_url: str = "http://localhost:8181"
    user_roles_rule_path: str = "/v1/data/policy/users/{user_id}/roles"


config = Config()

app = FastAPI(
    title="OPToggles Demo API",
    version="0.1.0",
    middleware=[
        Middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    ]
)


@app.get("/users/{user_id}/roles", response_model=list[str])
async def get_user_roles(
    user_id: Annotated[str, Path(..., description="The ID of the user to get roles for")]
) -> list[str]:
    async with aiohttp.ClientSession(config.opa_url) as session:
        resp = await session.get(config.user_roles_rule_path.format(user_id=user_id))
        resp.raise_for_status()
        result = (await resp.json()).get("result", [])
        return result


@app.get("/users/{user_id}/attributes", response_model=dict[str, Any])
async def get_user_attributes(
    user_id: Annotated[str, Path(..., description="The ID of the user to get attributes for")]
) -> dict[str, Any]:
    async with aiohttp.ClientSession(config.opa_url) as session:
        resp = await session.get(f"/v1/data/policy/users/{user_id}")
        resp.raise_for_status()
        result = (await resp.json()).get("result", {})
        return TypeAdapter(dict[str, Any]).validate_python(result.get("attributes", {}))


@app.get("/roles", response_model=list[str])
async def get_roles(
    exclude_customer: Annotated[bool, Query(..., description="Exclude customer roles")] = False,
    exclude_employee: Annotated[bool, Query(..., description="Exclude employee roles")] = False,
    exclude_billing: Annotated[bool, Query(..., description="Exclude billing roles")] = False,
) -> list[str]:
    def get_roles():
        if not exclude_customer:
            yield "customer"
        if not exclude_employee:
            yield "employee"
        if not exclude_billing:
            yield "billing"

    return list(get_roles())


@app.get("/attributes", response_model=dict[str, Any])
async def get_attributes(
    result: Annotated[Any, Query(..., description="The attributes to return")]
):
    return TypeAdapter(dict[str, Any]).validate_json(result)


if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8081)
