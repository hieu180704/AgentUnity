---
name: worktree
description: Tạo và quản lý Git Worktree độc lập để thử nghiệm (Spike) hoặc Refactor lớn mà không làm bẩn Scene/Library cache của dự án chính. Dùng khi gõ "/worktree", "tách nhánh song song", "spike test".
---

# /worktree — Thử Nghiệm Song Song Qua Git Worktree

# Mục lục
1. [Mục Đích](#1-mục-đích)
2. [Lợi Ích Của Git Worktree Trong Dự Án Unity](#2-lợi-ích-của-git-worktree-trong-dự-án-unity)
3. [Quy Trình Tạo & Vận Hành Worktree](#3-quy-trình-tạo--vận-hành-worktree)
4. [Quy Trình Dọn Dẹp Sau Khi Xong](#4-quy-trình-dọn-dẹp-sau-khi-xong)

---

# 1. Mục Đích
Tạo một thư mục làm việc song song độc lập (Git Worktree) để AI thực hiện các đợt tái cấu trúc quy mô lớn, thử nghiệm kiến trúc mới (Spike) hoặc sửa lỗi khẩn cấp mà **không phải switch branch trực tiếp trên project Unity chính**, tránh làm Unity Editor phải recompile/reimport toàn bộ Library cache.

---

# 2. Lợi Ích Của Git Worktree Trong Dự Án Unity
- **Zero Cache Invalidation:** Unity Editor chính vẫn giữ nguyên trạng thái mở, không bị gián đoạn hay reload Library.
- **Thử Nghiệm Thoải Mái:** AI có thể thử nghiệm xóa/tách code tự do trong thư mục worktree. Nếu thất bại, chỉ cần xóa thư mục mà không ảnh hưởng gì đến codebase chính.

---

# 3. Quy Trình Tạo & Vận Hành Worktree

### Bước 1: Tạo Worktree Mới
```powershell
git worktree add -b spike/<tên-thử-nghiệm> ../<tên-project>-worktree-<tên-thử-nghiệm> main
```

### Bước 2: Thực Hiện Thử Nghiệm / Refactor
- Chuyển không gian làm việc sang thư mục worktree vừa tạo.
- Viết code, chạy Unit Test, verify logic.

### Bước 3: Merge Hoặc Chốt Thay Đổi
- Khi thử nghiệm thành công: Commit các thay đổi trên branch `spike/...`.
- Quay lại project chính và merge branch vào `main`:
  ```powershell
  git merge spike/<tên-thử-nghiệm>
  ```

---

# 4. Quy Trình Dọn Dẹp Sau Khi Xong
Xóa bỏ thư mục worktree để giải phóng dung lượng ổ đĩa:
```powershell
git worktree remove ../<tên-project>-worktree-<tên-thử-nghiệm>
git branch -d spike/<tên-thử-nghiệm>
```
