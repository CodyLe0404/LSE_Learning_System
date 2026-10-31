from __future__ import annotations

from typing import Any, Dict
import pyodbc
import json


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

    def update_user_permissions_code(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        cursor = self.conn.cursor()
        try:
            user_id = payload.get("userId")
            added_list = payload.get("added", [])
            removed_list = payload.get("removed", [])
            updated_by = payload.get("updatedBy", '')
            
            added_json = json.dumps(added_list)
            removed_json = json.dumps(removed_list)
            
            cursor.execute(
                "EXEC [E_Learning].[dbo].[USP_LMS_Update_User_Permission] @UserId = ?, @AddedJson = ?, @RemovedJson = ?, @UpdatedBy = ?",
                (user_id, added_json, removed_json, updated_by)
            )
            
            # Lấy kết quả trả về từ câu lệnh SELECT cuối cùng của Store Procedure
            row = cursor.fetchone()
            self.conn.commit()
            
            if row:
                # Tuỳ vào thư viện DB (pyodbc, pymssql,...), row có thể là tuple hoặc row object
                # Giả sử pyodbc trả về tuple hoặc hỗ trợ truy cập dạng cột
                is_success = row[0] if isinstance(row, tuple) else row.IsSuccess
                message = row[1] if isinstance(row, tuple) else row.Message
                
                return {
                    "success": bool(is_success),
                    "message": message
                }
            
            return {"success": True, "message": "Cập nhật thành công"}
            
        except Exception as e:
            self.conn.rollback()
            # Trả về kết quả lỗi dạng dictionary thay vì raise exception ngầm làm sập app (hoặc tùy cấu trúc team bạn)
            return {"success": False, "message": str(e)}
        finally:
            cursor.close()
