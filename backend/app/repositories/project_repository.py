from __future__ import annotations

from typing import Any
import pyodbc


class ProjectRepository:
    def __init__(self, conn: pyodbc.Connection) -> None:
        self.conn = conn

    def get_project_details(self) -> list[dict[str, Any]]:
        cursor = self.conn.cursor()
        try:
            cursor.execute("EXEC [Design_System].[dbo].[USP_PM_Get_Project_Detail]")
            columns = [col[0] for col in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
        finally:
            cursor.close()

    def check_login(self, user_id: str, password: str) -> dict[str, Any] | None:
        cursor = self.conn.cursor()
        try:
            cursor.execute("EXEC E_Learning.dbo.USP_LMS_Check_User_Login ?, ?", user_id, password)
            row = cursor.fetchone()
            if not row:
                return None
            
            cursor.execute("EXEC E_Learning.dbo.USP_LMS_Get_Permission_Code ?", row.UserId)
            get_per = cursor.fetchall()
            if not get_per:
                return None

            return {
                "userId": row.UserId,
                "employeeId": row.EmployeeCode,
                "displayName": row.FullName,
                "email": row.Email,
                "userConfig": [item[0] for item in get_per],
            }
        finally:
            cursor.close()

    def change_user_password(self, user_id: str, current_pw: str, new_pw: str) -> tuple[int, str]:
        cursor = self.conn.cursor()
        try:
            result = cursor.execute("EXEC E_Learning.dbo.USP_LMS_Change_User_Password ?, ?, ?", user_id, current_pw, new_pw)
            row = result.fetchone()
            if row is None or len(row) < 2:
                raise ValueError("Stored procedure did not return expected response.")
            return int(row[0]), str(row[1])
        finally:
            self.conn.commit()
            cursor.close()

    def get_item_data_missing(self) -> list[dict[str, Any]]:
        cursor = self.conn.cursor()
        try:
            cursor.execute("EXEC [Design_System].[dbo].[USP_PM_Get_Item_Missing_Data]")
            columns = [col[0] for col in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
        finally:
            cursor.close()

    def get_data_common(self, condition: str) -> list[dict[str, Any]]:
        cursor = self.conn.cursor()
        try:
            cursor.execute("EXEC [E_Learning].[dbo].[USP_LMS_Get_Common_Data] ?", condition)
            columns = [col[0] for col in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
        finally:
            cursor.close()


