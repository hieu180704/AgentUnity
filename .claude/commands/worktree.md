# Slash Command: /worktree

Tạo và quản lý Git Worktree độc lập để thử nghiệm tính năng hoặc Refactor lớn mà không làm bẩn Library cache.

## Hướng dẫn thực thi cho Claude Code:
1. Hỏi người dùng tên nhánh / mục tiêu thử nghiệm (Spike).
2. Tạo Git Worktree tại thư mục song song:
   ```bash
   git worktree add ../<ProjectName>-<FeatureName> -b feature/<FeatureName>
   ```
3. Hướng dẫn Dev mở worktree mới để làm việc an toàn.
4. Hỗ trợ dọn dẹp worktree sau khi hoàn thành:
   ```bash
   git worktree remove ../<ProjectName>-<FeatureName>
   ```
