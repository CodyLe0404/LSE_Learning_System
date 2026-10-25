
class UserPermissionBuilder:
    """
    Class chuyển đổi dữ liệu phẳng (flat records) từ Database 
    thành danh sách User đã được gom nhóm kèm theo mảng userConfig (PermissionCode).
    """

    @staticmethod
    def build_user_permissions(raw_data: list[dict]) -> list[dict]:
        """
        Gom nhóm danh sách quyền theo UserId và loại bỏ trùng lặp PermissionCode.

        :param raw_data: List các dict đại diện cho từng bản ghi trả về từ SQL Query/ORM
        :return: List các dict thông tin user và danh sách permission unique
        """
        users_map = {}

        for row in raw_data:
            user_id = row.get("UserId")
            if user_id is None:
                continue

            # Nếu user chưa tồn tại trong map thì khởi tạo thông tin cơ bản
            if user_id not in users_map:
                users_map[user_id] = {
                    "userId": user_id,
                    "employeeCode": str(row.get("EmployeeCode", "")),
                    "userName": row.get("Username", ""),
                    "fullName": row.get("FullName", ""),
                    "email": row.get("Email", ""),
                    "department": row.get("DepartmentName", ""),
                    "roleName": row.get("RoleName", ""),
                    "userConfig": []
                }

            # Thêm PermissionCode vào mảng userConfig nếu chưa tồn tại
            perm_code = row.get("PermissionCode")
            if perm_code and perm_code not in users_map[user_id]["userConfig"]:
                users_map[user_id]["userConfig"].append(perm_code)

        return list(users_map.values())


